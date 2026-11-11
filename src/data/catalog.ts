import raw from './catalog.json'
import type { Catalog, RelatedDoc, Scenario, Shortcut, TocNode } from './types'

export const catalog = raw as Catalog

const nodeMap = new Map(catalog.nodes.map((node) => [node.id, node]))

export const officialReadUrl = catalog.standard.officialUrls.openstd

export function getNode(id: string): TocNode | undefined {
  return nodeMap.get(id)
}

export function getChildren(id: string): TocNode[] {
  return catalog.nodes.filter((node) => node.parentId === id)
}

export function getRootNodes(): TocNode[] {
  return catalog.nodes.filter((node) => node.parentId === null)
}

export function getParent(node: TocNode): TocNode | undefined {
  return node.parentId ? nodeMap.get(node.parentId) : undefined
}

export function getBreadcrumbs(id: string): TocNode[] {
  const trail: TocNode[] = []
  let current = nodeMap.get(id)
  while (current) {
    trail.unshift(current)
    current = current.parentId ? nodeMap.get(current.parentId) : undefined
  }
  return trail
}

export function formatNodeLabel(node: TocNode): string {
  if (node.level === 'appendix') return node.title
  return `${node.number}　${node.title}`
}

export function shortNumber(node: TocNode): string {
  if (node.level === 'appendix') return '附录'
  return node.level === 'chapter' ? `第${node.number}章` : node.number
}

export function getScenario(id: string): Scenario | undefined {
  return catalog.scenarios.find((item) => item.id === id)
}

export function getShortcut(id: string): Shortcut | undefined {
  return catalog.shortcuts.find((item) => item.id === id)
}

export function resolveNodes(ids: string[]): TocNode[] {
  return ids.map((id) => nodeMap.get(id)).filter((node): node is TocNode => Boolean(node))
}

export function getRelatedDocs(): RelatedDoc[] {
  return catalog.relatedDocs
}
