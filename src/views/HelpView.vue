<script setup lang="ts">
import { useRouter } from 'vue-router'
import { catalog, officialReadUrl } from '../data/catalog'

const router = useRouter()
const publicUrl = 'https://zchange.github.io/blasting-regs/'

function onBack() {
  if (window.history.length > 1) router.back()
  else router.push({ name: 'me' })
}
</script>

<template>
  <div class="page">
    <van-nav-bar title="使用说明" left-arrow @click-left="onBack" />

    <section class="section">
      <div class="section-title">按场景和作业类型进入</div>
      <div class="card help-card">
        <p>
          打开应用先到<RouterLink class="link-out" :to="{ name: 'home' }">首页</RouterLink>。上方「常用」是现场高频入口，比如盲炮处理、安全允许距离；下方「按作业类型」可按露天、地下、高温、水下、拆除与城镇浅孔、特种爆破进入，一般会先看到通用规定，再进对应专章。
        </p>
      </div>
    </section>

    <section class="section">
      <div class="section-title">用目录浏览到「节」</div>
      <div class="card help-card">
        <p>
          点底部<RouterLink class="link-out" :to="{ name: 'toc' }">「目录」</RouterLink>，可以看到 GB 6722-2014 的 14 章公开书目，点开一章就能看到节。公开目录只到「节」，没有官方公开的条标题时不会编造；也可用页内搜索筛选章或节标题，并用「全部展开 / 全部收起」快速浏览。
        </p>
      </div>
    </section>

    <section class="section">
      <div class="section-title">用关键词或条号检索</div>
      <div class="card help-card">
        <p>
          在<RouterLink class="link-out" :to="{ name: 'home' }">首页</RouterLink>或<RouterLink class="link-out" :to="{ name: 'search' }">「检索」</RouterLink>页输入关键词（如「盲炮」「飞石」）、别名或章条号（如 13.2、6.9），即可定位到对应目录条目。检索只覆盖目录标题、标签和别名，不包含规程正文。
        </p>
      </div>
    </section>

    <section class="section">
      <div class="section-title">原文在官方系统阅读</div>
      <div class="card help-card">
        <p>
          本应用不收录规程正文。在条目页点「在官方系统阅读」，会跳转到<a
            class="link-out"
            :href="officialReadUrl"
            target="_blank"
            rel="noopener noreferrer"
          >国家标准全文公开系统</a>，查看现行 GB 6722-2014（含第 1 号修改单）。标准号、修改单和官方渠道也可在底部<RouterLink class="link-out" :to="{ name: 'info' }">「标准」</RouterLink>页核对。
        </p>
      </div>
    </section>

    <section class="section">
      <div class="section-title">在「我的」导入官方 PDF</div>
      <div class="card help-card">
        <p>
          如果已从官方或授权渠道合法取得 PDF，可到<RouterLink class="link-out" :to="{ name: 'me' }">「我的」</RouterLink>里的「本机导入的合法文本」选择文件。文件只保存在本机，不会上传；导入后可在本机打开。部分带版权保护的官方 PDF 可能无法在此打开，请改用<a
            class="link-out"
            :href="officialReadUrl"
            target="_blank"
            rel="noopener noreferrer"
          >官方系统</a>。
        </p>
      </div>
    </section>

    <section class="section">
      <div class="section-title">公开网址和添加到主屏幕</div>
      <div class="card help-card">
        <p>
          电脑或手机浏览器打开
          <a class="link-out" :href="publicUrl" target="_blank" rel="noopener noreferrer">{{ publicUrl }}</a>
          即可使用。在手机浏览器里还可以把应用添加到主屏幕，之后能像小程序一样直接打开。
        </p>
      </div>
    </section>

    <p class="disclaimer">{{ catalog.disclaimer }}</p>
  </div>
</template>

<style scoped>
.help-card {
  padding: 14px 16px;
}

.help-card p {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.65;
}
</style>
