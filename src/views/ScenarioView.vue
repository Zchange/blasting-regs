<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getScenario, resolveNodes } from '../data/catalog'
import EntryRow from '../components/EntryRow.vue'
import OfficialActions from '../components/OfficialActions.vue'

const route = useRoute()
const router = useRouter()
const scenario = computed(() => getScenario(String(route.params.id)))
const general = computed(() => (scenario.value ? resolveNodes(scenario.value.generalIds) : []))
const special = computed(() => (scenario.value ? resolveNodes(scenario.value.specialIds) : []))
</script>

<template>
  <div class="page">
    <van-nav-bar left-arrow :title="scenario?.title ?? '作业类型'" @click-left="router.back()" />
    <div v-if="!scenario" class="section">
      <van-empty description="未找到该作业类型" />
    </div>
    <template v-else>
      <p class="notice">{{ scenario.brief }} 以下仅为目录导航，不含规程正文。</p>
      <section class="section">
        <div class="section-title">必看通用规定<span>第 6 / 13 / 14 章相关节</span></div>
        <div class="list-gap">
          <EntryRow v-for="node in general" :key="node.id" :node="node" />
        </div>
      </section>
      <section class="section">
        <div class="section-title">本类型专章</div>
        <div class="list-gap">
          <EntryRow v-for="node in special" :key="node.id" :node="node" />
        </div>
      </section>
      <section class="section">
        <OfficialActions compact />
      </section>
    </template>
  </div>
</template>
