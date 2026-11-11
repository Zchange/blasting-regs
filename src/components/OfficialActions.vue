<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { officialReadUrl } from '../data/catalog'
import { hasPdf } from '../lib/pdfStore'

const props = defineProps<{ compact?: boolean }>()
const router = useRouter()
const imported = ref(false)

onMounted(async () => {
  imported.value = await hasPdf()
})

function openOfficial() {
  window.open(officialReadUrl, '_blank', 'noopener,noreferrer')
}

function openLocal() {
  if (imported.value) router.push({ name: 'pdf' })
  else router.push({ name: 'me', query: { import: '1' } })
}
</script>

<template>
  <div class="actions">
    <van-button type="primary" block @click="openOfficial">在官方系统阅读</van-button>
    <van-button plain type="primary" block @click="openLocal">
      {{ imported ? '打开已导入的本地文本' : '导入合法文本后在本机阅读' }}
    </van-button>
    <p v-if="!props.compact" class="muted" style="margin: 0; text-align: center">
      本应用不提供规程正文。官方渠道阅读，或仅在本机打开您合法取得的文件。
    </p>
  </div>
</template>
