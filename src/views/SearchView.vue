<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { searchCatalog, type SearchHit } from '../lib/search'
import EntryRow from '../components/EntryRow.vue'
import { catalog } from '../data/catalog'

const route = useRoute()
const router = useRouter()
const keyword = ref(String(route.query.q ?? ''))
const hits = ref<SearchHit[]>([])

function runSearch(value: string) {
  hits.value = searchCatalog(value)
}

watch(
  () => route.query.q,
  (q) => {
    const next = String(q ?? '')
    keyword.value = next
    runSearch(next)
  },
  { immediate: true },
)

function submit() {
  const q = keyword.value.trim()
  router.replace({ name: 'search', query: q ? { q } : {} })
  runSearch(q)
}

const nodeHits = computed(() => hits.value.filter((hit) => hit.kind === 'node'))
const docHits = computed(() => hits.value.filter((hit) => hit.kind === 'doc'))
</script>

<template>
  <div class="page">
    <van-nav-bar title="检索" left-arrow @click-left="router.back()" />
    <div style="padding: 12px 16px 0">
      <van-search
        v-model="keyword"
        show-action
        placeholder="关键词、别名或章条号，如 6.9、飞石"
        action-text="搜索"
        @search="submit"
        @cancel="router.push('/')"
        @click-right="submit"
      />
    </div>
    <p class="notice">检索范围为目录标题、标签和别名，不包含规程正文。</p>

    <section v-if="!keyword.trim()" class="section">
      <div class="empty-hint">输入关键词或章条号开始查找。</div>
    </section>

    <template v-else>
      <section class="section">
        <div class="section-title">
          规程目录
          <span>{{ nodeHits.length }} 条</span>
        </div>
        <div v-if="nodeHits.length" class="list-gap">
          <EntryRow
            v-for="hit in nodeHits"
            :key="hit.id"
            :node="hit.node"
            :caption="hit.exactNumber ? '精确匹配章条号' : undefined"
          />
        </div>
        <div v-else class="empty-hint">没有匹配的章或节。可试试别名，例如「瞎炮」「安全距离」。</div>
      </section>

      <section v-if="docHits.length" class="section">
        <div class="section-title">相关文件（仅书目）<span>不含正文</span></div>
        <div class="list-gap">
          <a
            v-for="hit in docHits"
            :key="hit.id"
            class="doc-card"
            :href="hit.doc.officialUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div class="kind">{{ hit.doc.kind }} · {{ hit.doc.number }}</div>
            <h3>{{ hit.doc.title }}</h3>
            <p>{{ hit.doc.note }}</p>
            <span class="link-out">打开官方页面</span>
          </a>
        </div>
      </section>
    </template>

    <p class="disclaimer">{{ catalog.disclaimer }}</p>
  </div>
</template>
