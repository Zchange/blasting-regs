<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { catalog, resolveNodes } from '../data/catalog'
import { getRecent } from '../lib/storage'
import EntryRow from '../components/EntryRow.vue'

const router = useRouter()
const keyword = ref('')
const recents = computed(() => resolveNodes(getRecent().slice(0, 5).map((item) => item.id)))

const shortcuts = catalog.shortcuts
const scenarios = catalog.scenarios

function onSearch() {
  const q = keyword.value.trim()
  if (!q) {
    router.push({ name: 'search' })
    return
  }
  router.push({ name: 'search', query: { q } })
}
</script>

<template>
  <div class="page">
    <header class="hero">
      <div class="meta">
        {{ catalog.standard.number }} · {{ catalog.standard.kind }}
        <span class="status-pill">{{ catalog.standard.status }}</span>
      </div>
      <h1>{{ catalog.standard.title }}查询</h1>
      <form @submit.prevent="onSearch">
        <van-search
          v-model="keyword"
          shape="round"
          placeholder="搜关键词、章条号或别名，如 盲炮、13.2、飞石"
          @search="onSearch"
        />
      </form>
    </header>

    <p class="notice">
      本工具提供目录、场景和检索导航，<strong>不收录规程正文</strong>。阅读原文请前往国家标准全文公开系统，或在「我的」中导入您合法取得的文本。
    </p>

    <section class="section">
      <div class="section-title">常用<span>现场高频入口</span></div>
      <div class="grid-2">
        <RouterLink
          v-for="item in shortcuts"
          :key="item.id"
          class="shortcut-card"
          :to="{ name: 'shortcut', params: { id: item.id } }"
        >
          <strong>{{ item.title }}</strong>
          <em>{{ item.subtitle }}</em>
        </RouterLink>
      </div>
    </section>

    <section class="section">
      <div class="section-title">按作业类型<span>先看通用规定，再进专章</span></div>
      <div class="grid-2">
        <RouterLink
          v-for="item in scenarios"
          :key="item.id"
          class="scenario-card"
          :to="{ name: 'scenario', params: { id: item.id } }"
        >
          <strong>{{ item.title }}</strong>
          <em>{{ item.brief }}</em>
        </RouterLink>
      </div>
    </section>

    <section v-if="recents.length" class="section">
      <div class="section-title">
        最近查看
        <RouterLink to="/me" class="link-out">全部</RouterLink>
      </div>
      <div class="list-gap">
        <EntryRow v-for="node in recents" :key="node.id" :node="node" />
      </div>
    </section>

    <p class="disclaimer">{{ catalog.disclaimer }}</p>
  </div>
</template>
