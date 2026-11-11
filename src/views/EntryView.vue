<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  catalog,
  formatNodeLabel,
  getBreadcrumbs,
  getChildren,
  getNode,
  officialReadUrl,
  resolveNodes,
  shortNumber,
} from '../data/catalog'
import { isFavorite, pushRecent, toggleFavorite } from '../lib/storage'
import { ref } from 'vue'
import OfficialActions from '../components/OfficialActions.vue'
import EntryRow from '../components/EntryRow.vue'

const route = useRoute()
const router = useRouter()

const node = computed(() => getNode(String(route.params.id)))
const crumbs = computed(() => (node.value ? getBreadcrumbs(node.value.id) : []))
const children = computed(() => (node.value ? getChildren(node.value.id) : []))
const related = computed(() => (node.value ? resolveNodes(node.value.relatedIds) : []))
const fav = ref(false)

watch(
  node,
  (value) => {
    if (!value) return
    pushRecent(value.id)
    fav.value = isFavorite(value.id)
  },
  { immediate: true },
)

function onToggleFav() {
  if (!node.value) return
  fav.value = toggleFavorite(node.value.id)
}

function onBack() {
  if (window.history.length > 1) router.back()
  else router.push('/toc')
}
</script>

<template>
  <div class="page">
    <van-nav-bar left-arrow :title="node ? shortNumber(node) : '条目'" @click-left="onBack">
      <template #right>
        <van-icon
          :name="fav ? 'star' : 'star-o'"
          size="20"
          :color="fav ? '#f0c27b' : '#fffdf8'"
          @click="onToggleFav"
        />
      </template>
    </van-nav-bar>

    <div v-if="!node" class="section">
      <van-empty description="未找到该目录条目" />
      <div style="text-align: center">
        <van-button type="primary" size="small" @click="router.push('/toc')">返回目录</van-button>
      </div>
    </div>

    <template v-else>
      <section class="section">
        <div class="breadcrumbs">
          <template v-for="(crumb, index) in crumbs" :key="crumb.id">
            <span v-if="index > 0" class="crumb-sep">/</span>
            <RouterLink v-if="crumb.id !== node.id" :to="{ name: 'entry', params: { id: crumb.id } }">
              {{ formatNodeLabel(crumb) }}
            </RouterLink>
            <span v-else>{{ formatNodeLabel(crumb) }}</span>
          </template>
        </div>
        <div class="card" style="padding: 16px">
          <div class="muted">{{ catalog.standard.number }} · {{ node.level === 'chapter' ? '章' : node.level === 'section' ? '节' : '附录' }}</div>
          <h2 style="margin: 6px 0 8px; font-size: 1.25rem; line-height: 1.35">
            <span v-if="node.level !== 'appendix'">{{ node.number }}　</span>{{ node.title }}
          </h2>
          <div class="tag-row">
            <span v-if="node.amendmentFlag" class="chip chip-warn">含修改单提示</span>
            <span v-for="tag in node.tags" :key="tag" class="chip">{{ tag }}</span>
          </div>
        </div>

        <div v-if="node.amendmentFlag" class="amend-banner">
          <strong>第 1 号修改单提示。</strong>
          {{ node.amendmentNote }}
        </div>

        <OfficialActions />

        <div v-if="children.length">
          <div class="section-title">下级目录<span>{{ children.length }} 节</span></div>
          <div class="list-gap">
            <EntryRow v-for="child in children" :key="child.id" :node="child" />
          </div>
        </div>

        <div v-if="related.length" style="margin-top: 16px">
          <div class="section-title">相关目录</div>
          <div class="list-gap">
            <EntryRow v-for="item in related" :key="item.id" :node="item" />
          </div>
        </div>
      </section>
      <p class="disclaimer">
        本条目只提供编号、标题与导航。正文请在
        <a class="link-out" :href="officialReadUrl" target="_blank" rel="noopener noreferrer">国家标准全文公开系统</a>
        阅读。{{ catalog.disclaimer }}
      </p>
    </template>
  </div>
</template>
