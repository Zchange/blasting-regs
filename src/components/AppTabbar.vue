<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const active = computed(() => (route.meta.tab as string) || 'home')

function onChange(name: string | number) {
  const map: Record<string, string> = {
    home: '/',
    toc: '/toc',
    info: '/info',
    me: '/me',
  }
  const path = map[String(name)]
  if (path && route.path !== path) router.push(path)
}
</script>

<template>
  <van-tabbar :model-value="active" @change="onChange" placeholder safe-area-inset-bottom>
    <van-tabbar-item name="home" icon="search">首页</van-tabbar-item>
    <van-tabbar-item name="toc" icon="bars">目录</van-tabbar-item>
    <van-tabbar-item name="info" icon="info-o">标准</van-tabbar-item>
    <van-tabbar-item name="me" icon="user-o">我的</van-tabbar-item>
  </van-tabbar>
</template>
