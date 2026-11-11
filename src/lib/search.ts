import MiniSearch, { type SearchResult } from 'minisearch'
import { catalog, getNode } from '../data/catalog'
import type { RelatedDoc, TocNode } from '../data/types'

export interface NodeHit {
  kind: 'node'
  id: string
  node: TocNode
  score: number
  exactNumber: boolean
}

export interface DocHit {
  kind: 'doc'
  id: string
  doc: RelatedDoc
  score: number
}

export type SearchHit = NodeHit | DocHit

const NUMBER_RE = /(?:第\s*)?(\d+(?:\.\d+)*)(?:\s*条|\s*章)?/g

function tokenize(text: string): string[] {
  const tokens = new Set<string>()
  const source = text.toLowerCase().trim()
  if (!source) return []

  for (const match of source.matchAll(/\d+(?:\.\d+)*/g)) {
    tokens.add(match[0])
  }

  try {
    const segmenter = new Intl.Segmenter('zh-CN', { granularity: 'word' })
    for (const part of segmenter.segment(source)) {
      const piece = part.segment.trim().toLowerCase()
      if (piece && (part.isWordLike || /[\u4e00-\u9fff]/.test(piece))) {
        tokens.add(piece)
      }
    }
  } catch {
    for (let i = 0; i < source.length; i += 1) {
      const ch = source[i]
      if (ch && /[\u4e00-\u9fff]/.test(ch)) tokens.add(ch)
    }
    for (const part of source.split(/[\s,;，。、/]+/)) {
      if (part) tokens.add(part)
    }
  }

  return [...tokens]
}

function expandQuery(query: string): string {
  let expanded = query
  for (const [alias, canonical] of Object.entries(catalog.queryAliases)) {
    if (query.includes(alias) && !query.includes(canonical)) {
      expanded += ` ${canonical}`
    }
  }
  return expanded
}

function extractNumbers(query: string): string[] {
  const numbers: string[] = []
  for (const match of query.matchAll(NUMBER_RE)) {
    if (match[1]) numbers.push(match[1])
  }
  return numbers
}

const nodeIndex = new MiniSearch({
  fields: ['number', 'title', 'tags', 'aliases', 'levelLabel'],
  storeFields: ['id'],
  tokenize,
  searchOptions: { tokenize, prefix: true, fuzzy: 0.15, combineWith: 'AND' },
})

nodeIndex.addAll(
  catalog.nodes.map((node) => ({
    id: node.id,
    number: node.number,
    title: node.title,
    tags: node.tags.join(' '),
    aliases: node.aliases.join(' '),
    levelLabel: node.level === 'chapter' ? `第${node.number}章` : '',
  })),
)

const docIndex = new MiniSearch({
  fields: ['number', 'title', 'kind', 'aliases', 'note'],
  storeFields: ['id'],
  tokenize,
  searchOptions: { tokenize, prefix: true, fuzzy: 0.15, combineWith: 'AND' },
})

docIndex.addAll(
  catalog.relatedDocs.map((doc) => ({
    id: doc.id,
    number: doc.number,
    title: doc.title,
    kind: doc.kind,
    aliases: (doc.aliases ?? []).join(' '),
    note: doc.note,
  })),
)

function toNodeHits(results: SearchResult[], exactNumbers: string[]): NodeHit[] {
  const hits: NodeHit[] = []
  for (const result of results) {
    const node = getNode(String(result.id))
    if (!node) continue
    const exactNumber = exactNumbers.includes(node.number)
    hits.push({
      kind: 'node',
      id: node.id,
      node,
      score: result.score + (exactNumber ? 50 : 0),
      exactNumber,
    })
  }
  return hits.sort((a, b) => b.score - a.score)
}

export function searchCatalog(rawQuery: string): SearchHit[] {
  const query = rawQuery.trim()
  if (!query) return []

  const exactNumbers = extractNumbers(query)
  const expanded = expandQuery(query)

  const nodeHits = toNodeHits(
    nodeIndex.search(expanded, {
      tokenize,
      prefix: true,
      fuzzy: expanded.length > 1 ? 0.15 : 0,
      combineWith: exactNumbers.length && expanded === query ? 'OR' : 'AND',
      boost: { number: 4, title: 2, aliases: 2, tags: 1.5 },
    }),
    exactNumbers,
  )

  // If AND recall is too strict for short Chinese queries, relax once.
  const relaxed =
    nodeHits.length === 0
      ? toNodeHits(
          nodeIndex.search(expanded, {
            tokenize,
            prefix: true,
            fuzzy: 0.2,
            combineWith: 'OR',
            boost: { number: 4, title: 2, aliases: 2, tags: 1.5 },
          }),
          exactNumbers,
        )
      : nodeHits

  // Guarantee exact section/chapter number matches even if the indexer misses.
  const guaranteed = new Map(relaxed.map((hit) => [hit.id, hit]))
  for (const number of exactNumbers) {
    const node = catalog.nodes.find((item) => item.number === number)
    if (node && !guaranteed.has(node.id)) {
      guaranteed.set(node.id, {
        kind: 'node',
        id: node.id,
        node,
        score: 100,
        exactNumber: true,
      })
    }
  }

  const docs: DocHit[] = docIndex
    .search(expanded, {
      tokenize,
      prefix: true,
      fuzzy: 0.15,
      combineWith: 'OR',
    })
    .map((result) => {
      const doc = catalog.relatedDocs.find((item) => item.id === result.id)
      if (!doc) return null
      return { kind: 'doc' as const, id: doc.id, doc, score: result.score }
    })
    .filter((item): item is DocHit => Boolean(item))

  const nodes = [...guaranteed.values()].sort((a, b) => {
    if (a.exactNumber !== b.exactNumber) return a.exactNumber ? -1 : 1
    return b.score - a.score
  })

  return [...nodes, ...docs]
}
