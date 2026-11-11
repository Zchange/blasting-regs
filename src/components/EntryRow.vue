<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { shortNumber } from '../data/catalog'
import type { TocNode } from '../data/types'

defineProps<{
  node: TocNode
  caption?: string
}>()
</script>

<template>
  <RouterLink class="entry-row" :to="{ name: 'entry', params: { id: node.id } }">
    <div class="num-badge" :class="{ 'is-amend': node.amendmentFlag }">
      {{ shortNumber(node) }}
    </div>
    <div class="body">
      <div class="title">{{ node.title }}</div>
      <div v-if="caption" class="muted" style="margin-top: 4px">{{ caption }}</div>
      <div v-else-if="node.tags.length || node.amendmentFlag" class="tag-row">
        <span v-if="node.amendmentFlag" class="chip chip-warn">含修改单提示</span>
        <span v-for="tag in node.tags.slice(0, 3)" :key="tag" class="chip">{{ tag }}</span>
      </div>
    </div>
  </RouterLink>
</template>
