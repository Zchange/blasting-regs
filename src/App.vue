<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppTabbar from './components/AppTabbar.vue'

const route = useRoute()
const showTabbar = computed(() => !route.meta.hideTabbar)

const themeVars = {
  navBarBackground: '#16324f',
  navBarTitleTextColor: '#fffdf8',
  navBarIconColor: '#fffdf8',
  tabbarItemActiveColor: '#c24e1e',
  buttonPrimaryBackground: '#16324f',
  buttonPrimaryBorderColor: '#16324f',
  searchBackground: 'transparent',
}
</script>

<template>
  <van-config-provider :theme-vars="themeVars">
    <div class="app-shell">
      <router-view />
      <AppTabbar v-if="showTabbar" />
    </div>
  </van-config-provider>
</template>
