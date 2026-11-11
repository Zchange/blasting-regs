import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const catalog = JSON.parse(readFileSync(join(root, '../src/data/catalog.json'), 'utf8'))

const errors = []
const ids = new Set()
for (const node of catalog.nodes) {
  if (ids.has(node.id)) errors.push(`duplicate id ${node.id}`)
  ids.add(node.id)
  if (!node.number || !node.title || !node.level) errors.push(`incomplete node ${node.id}`)
  if (node.parentId && !catalog.nodes.some((item) => item.id === node.parentId)) {
    errors.push(`missing parent ${node.parentId} for ${node.id}`)
  }
  for (const related of node.relatedIds ?? []) {
    if (!ids.has(related) && !catalog.nodes.some((item) => item.id === related)) {
      errors.push(`missing related ${related} for ${node.id}`)
    }
  }
  const forbidden = ['不应', '不应小于', '公式', 'cm/s', '千克']
  const blob = `${node.title} ${(node.amendmentNote ?? '')}`
  // Titles themselves are bibliographic; only fail if a note looks like copied operative text.
  if (node.amendmentNote && forbidden.some((word) => node.amendmentNote.includes(word))) {
    errors.push(`amendment note for ${node.id} looks like body text: ${blob.slice(0, 80)}`)
  }
}

const idSet = new Set(catalog.nodes.map((node) => node.id))
for (const shortcut of catalog.shortcuts) {
  for (const id of shortcut.targetIds) {
    if (!idSet.has(id)) errors.push(`shortcut ${shortcut.id} missing ${id}`)
  }
}
for (const scenario of catalog.scenarios) {
  for (const id of [...scenario.generalIds, ...scenario.specialIds]) {
    if (!idSet.has(id)) errors.push(`scenario ${scenario.id} missing ${id}`)
  }
}
if (!idSet.has(catalog.standard.amendment.affectedSectionId)) {
  errors.push('amendment affected section missing')
}

if (errors.length) {
  console.error('catalog check failed:\n' + errors.join('\n'))
  process.exit(1)
}

console.log(`catalog ok: ${catalog.nodes.length} nodes, ${catalog.scenarios.length} scenarios, ${catalog.shortcuts.length} shortcuts`)
