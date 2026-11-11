<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showDialog, showToast } from 'vant'
import { catalog, resolveNodes } from '../data/catalog'
import { getFavorites, getFontSize, getRecent, setFontSize, type FontSize } from '../lib/storage'
import { hasPdf, loadPdfMeta, removePdf, savePdf } from '../lib/pdfStore'
import EntryRow from '../components/EntryRow.vue'

const route = useRoute()
const router = useRouter()
const font = ref<FontSize>(getFontSize())
const imported = ref(false)
const meta = ref<{ name: string; size: number; importedAt: number } | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const favTick = ref(0)
const recentTick = ref(0)

const favorites = computed(() => {
  favTick.value
  return resolveNodes(getFavorites())
})
const recents = computed(() => {
  recentTick.value
  return resolveNodes(getRecent().map((item) => item.id))
})

async function refreshPdf() {
  imported.value = await hasPdf()
  meta.value = await loadPdfMeta()
}

onMounted(async () => {
  await refreshPdf()
  if (route.query.import === '1') {
    fileInput.value?.click()
  }
})

function onFont(size: FontSize) {
  font.value = size
  setFontSize(size)
}

async function onFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
  if (!isPdf) {
    showToast('请选择 PDF 文件')
    return
  }
  await savePdf(file)
  await refreshPdf()
  showToast('已保存在本机，不会上传')
}

async function onRemove() {
  try {
    await showDialog({
      title: '移除本地文本',
      message: '仅删除本机保存的文件副本，不会影响您的原件。',
      confirmButtonText: '移除',
      showCancelButton: true,
    })
  } catch {
    return
  }
  await removePdf()
  await refreshPdf()
  showToast('已移除')
}

function formatBytes(size: number): string {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function formatTime(at: number): string {
  return new Date(at).toLocaleString('zh-CN', { hour12: false })
}
</script>

<template>
  <div class="page">
    <header class="hero" style="padding-bottom: 18px">
      <div class="meta">收藏、最近与本机文本</div>
      <h1>我的</h1>
    </header>

    <section class="section">
      <div class="section-title">正文字号</div>
      <div class="font-switch" style="width: max-content">
        <button :class="{ 'is-on': font === 'sm' }" @click="onFont('sm')">较小</button>
        <button :class="{ 'is-on': font === 'md' }" @click="onFont('md')">标准</button>
        <button :class="{ 'is-on': font === 'lg' }" @click="onFont('lg')">较大</button>
      </div>
    </section>

    <section class="section">
      <div class="section-title">本机导入的合法文本</div>
      <div class="card" style="padding: 14px 16px">
        <p class="muted" style="margin: 0 0 10px; line-height: 1.55">
          仅在本设备打开您从国家标准全文公开系统或中国标准出版社等官方/授权渠道取得的文本。文件保存在浏览器本地，不会上传。部分官方 PDF 带有版权保护（如 FileOpen），可能无法在此打开，请改用官方系统阅读。
        </p>
        <input
          ref="fileInput"
          type="file"
          accept="application/pdf,.pdf"
          hidden
          @change="onFile"
        />
        <div v-if="imported && meta" style="margin-bottom: 10px; font-size: 0.88rem">
          <strong>{{ meta.name }}</strong>
          <div class="muted">{{ formatBytes(meta.size) }} · {{ formatTime(meta.importedAt) }}</div>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap">
          <van-button size="small" type="primary" @click="fileInput?.click()">
            {{ imported ? '更换文件' : '选择 PDF' }}
          </van-button>
          <van-button v-if="imported" size="small" type="primary" plain @click="router.push('/pdf')">打开</van-button>
          <van-button v-if="imported" size="small" @click="onRemove">移除</van-button>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-title">收藏<span>{{ favorites.length }}</span></div>
      <div v-if="favorites.length" class="list-gap">
        <EntryRow v-for="node in favorites" :key="node.id" :node="node" />
      </div>
      <div v-else class="empty-hint">在条目页点右上角星标即可收藏。</div>
    </section>

    <section class="section">
      <div class="section-title">最近查看<span>{{ recents.length }}</span></div>
      <div v-if="recents.length" class="list-gap">
        <EntryRow v-for="node in recents" :key="node.id" :node="node" />
      </div>
      <div v-else class="empty-hint">还没有浏览记录。</div>
    </section>

    <p class="disclaimer">{{ catalog.disclaimer }}</p>
  </div>
</template>
