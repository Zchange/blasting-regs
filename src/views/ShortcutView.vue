<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getShortcut, resolveNodes } from '../data/catalog'
import EntryRow from '../components/EntryRow.vue'
import OfficialActions from '../components/OfficialActions.vue'

const route = useRoute()
const router = useRouter()
const shortcut = computed(() => getShortcut(String(route.params.id)))
const nodes = computed(() => (shortcut.value ? resolveNodes(shortcut.value.targetIds) : []))
</script>

<template>
  <div class="page">
    <van-nav-bar left-arrow :title="shortcut?.title ?? '常用'" @click-left="router.back()" />
    <div v-if="!shortcut" class="section">
      <van-empty description="未找到该常用入口" />
    </div>
    <template v-else>
      <p class="notice">{{ shortcut.subtitle }}。请对照官方现行文本阅读对应章节，本页不提供条文或计算公式。</p>
      <section class="section">
        <div class="list-gap">
          <EntryRow v-for="node in nodes" :key="node.id" :node="node" />
        </div>
        <OfficialActions compact />
      </section>
    </template>
  </div>
</template>
