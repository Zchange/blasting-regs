<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import * as pdfjsLib from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { officialReadUrl } from '../data/catalog'
import { loadPdf } from '../lib/pdfStore'
import type { PDFDocumentLoadingTask, PDFDocumentProxy } from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

const router = useRouter()
const canvasRef = ref<HTMLCanvasElement | null>(null)
const pageNumber = ref(1)
const pageCount = ref(0)
const scale = ref(1.2)
const loading = ref(true)
const error = ref('')
const fileName = ref('')
let pdf: PDFDocumentProxy | null = null
let loadingTask: PDFDocumentLoadingTask | null = null

function openOfficial() {
  window.open(officialReadUrl, '_blank', 'noopener,noreferrer')
}

async function renderPage() {
  if (!pdf || !canvasRef.value) return
  const page = await pdf.getPage(pageNumber.value)
  const viewport = page.getViewport({ scale: scale.value })
  const canvas = canvasRef.value
  const context = canvas.getContext('2d')
  if (!context) return
  canvas.width = viewport.width
  canvas.height = viewport.height
  await page.render({ canvasContext: context, viewport, canvas }).promise
}

async function openStored() {
  loading.value = true
  error.value = ''
  try {
    const record = await loadPdf()
    if (!record) {
      error.value = '还没有导入本地文本。请先在「我的」中选择您合法取得的 PDF。'
      return
    }
    fileName.value = record.name
    const data = new Uint8Array(record.data.slice(0))
    loadingTask = pdfjsLib.getDocument({ data })
    pdf = await loadingTask.promise
    pageCount.value = pdf.numPages
    pageNumber.value = 1
    await nextTick()
    await renderPage()
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    if (message.includes('ENCRYPTED') || /password/i.test(message)) {
      error.value =
        '该文件受密码或版权保护插件限制，无法在本应用内打开。请改用国家标准全文公开系统阅读，或使用官方阅读工具打开原件。'
    } else {
      error.value =
        '无法解析该 PDF。若这是带 FileOpen 等版权保护的官方下载文件，请改用官方系统阅读。本应用不会破解或绕过保护措施。'
    }
  } finally {
    loading.value = false
  }
}

async function prev() {
  if (pageNumber.value <= 1) return
  pageNumber.value -= 1
  await renderPage()
}

async function next() {
  if (pageNumber.value >= pageCount.value) return
  pageNumber.value += 1
  await renderPage()
}

async function zoom(delta: number) {
  scale.value = Math.min(2.4, Math.max(0.7, scale.value + delta))
  await renderPage()
}

onMounted(openStored)
onUnmounted(() => {
  void loadingTask?.destroy()
  pdf = null
  loadingTask = null
})
</script>

<template>
  <div class="pdf-stage page--flush">
    <div class="pdf-toolbar">
      <van-button size="small" plain type="primary" color="#fffdf8" @click="router.push('/me')">返回</van-button>
      <div style="flex: 1; text-align: center; font-size: 0.8rem">
        <div>{{ fileName || '本地文本' }}</div>
        <div v-if="pageCount">{{ pageNumber }} / {{ pageCount }}</div>
      </div>
      <van-button size="small" plain type="primary" color="#fffdf8" @click="openOfficial">官方阅读</van-button>
    </div>

    <div v-if="loading" class="empty-hint" style="color: #ddd">正在打开本机文件…</div>

    <div v-else-if="error" style="padding: 24px 18px; line-height: 1.6">
      <p>{{ error }}</p>
      <van-button type="primary" block @click="openOfficial">前往国家标准全文公开系统</van-button>
    </div>

    <template v-else>
      <div style="display: flex; justify-content: center; gap: 8px; padding: 8px; background: #111821">
        <van-button size="small" :disabled="pageNumber <= 1" @click="prev">上一页</van-button>
        <van-button size="small" :disabled="pageNumber >= pageCount" @click="next">下一页</van-button>
        <van-button size="small" @click="zoom(-0.2)">缩小</van-button>
        <van-button size="small" @click="zoom(0.2)">放大</van-button>
      </div>
      <p class="muted" style="margin: 0; padding: 6px 12px; text-align: center; color: #c9c3b8; font-size: 0.75rem">
        v1 仅按页浏览，不能自动定位到某一节。请自行对照目录页码。文件只在本机处理。
      </p>
      <div class="pdf-canvas-wrap">
        <canvas ref="canvasRef" />
      </div>
    </template>
  </div>
</template>
