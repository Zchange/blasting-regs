<script setup lang="ts">
import { computed, ref } from 'vue'
import { catalog, getChildren, getRootNodes } from '../data/catalog'

const roots = getRootNodes()
const active = ref<string[]>(['GB6722-2014:6', 'GB6722-2014:13'])
const filter = ref('')

const filteredRoots = computed(() => {
  const q = filter.value.trim()
  if (!q) return roots
  return roots.filter((root) => {
    const children = getChildren(root.id)
    const blob = [root.number, root.title, ...children.map((c) => `${c.number}${c.title}`)].join('')
    return blob.includes(q)
  })
})

function expandKey(ids: string[]) {
  active.value = ids
}
</script>

<template>
  <div class="page">
    <header class="hero" style="padding-bottom: 16px">
      <div class="meta">{{ catalog.standard.number }} · 14 章公开书目目录</div>
      <h1>目录</h1>
      <van-search v-model="filter" placeholder="筛选章或节标题" />
    </header>
    <p class="notice">公开书目只到「节」。没有官方公开的条标题时，本应用停在节一级，不编造条文标题或正文。</p>
    <div style="padding: 8px 16px; display: flex; gap: 8px">
      <van-button size="small" plain type="primary" @click="expandKey(roots.map((r) => r.id))">全部展开</van-button>
      <van-button size="small" plain @click="expandKey([])">全部收起</van-button>
    </div>
    <van-collapse v-model="active" style="margin: 0 12px; background: transparent">
      <van-collapse-item
        v-for="root in filteredRoots"
        :key="root.id"
        :name="root.id"
        :is-link="false"
      >
        <template #title>
          <RouterLink
            class="link-out"
            :to="{ name: 'entry', params: { id: root.id } }"
            @click.stop
          >
            <template v-if="root.level === 'appendix'">{{ root.title }}</template>
            <template v-else>第{{ root.number }}章　{{ root.title }}</template>
            <span v-if="root.amendmentFlag" class="chip chip-warn" style="margin-left: 6px">修改单</span>
          </RouterLink>
        </template>
        <div v-if="getChildren(root.id).length" class="list-gap">
          <RouterLink
            v-for="child in getChildren(root.id)"
            :key="child.id"
            class="entry-row"
            :to="{ name: 'entry', params: { id: child.id } }"
          >
            <div class="num-badge" :class="{ 'is-amend': child.amendmentFlag }">{{ child.number }}</div>
            <div class="body">
              <div class="title">{{ child.title }}</div>
              <div v-if="child.amendmentFlag" class="tag-row">
                <span class="chip chip-warn">含修改单提示</span>
              </div>
            </div>
          </RouterLink>
        </div>
        <div v-else class="muted" style="padding: 4px 2px 8px">
          公开目录未列出本节的下级标题，请打开本条目后通过官方文本阅读。
        </div>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>
