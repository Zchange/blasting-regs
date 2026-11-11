<script setup lang="ts">
import { catalog, getNode, officialReadUrl, shortNumber } from '../data/catalog'

const standard = catalog.standard
const affected = getNode(standard.amendment.affectedSectionId)
</script>

<template>
  <div class="page">
    <header class="hero">
      <div class="meta">标准信息 · 核验日期 {{ standard.revisionPlan.checkedOn }}</div>
      <h1>{{ standard.title }}</h1>
      <p class="meta" style="margin-bottom: 0">{{ standard.titleEn }}</p>
    </header>

    <section class="section">
      <div class="card" style="padding: 12px 16px">
        <div class="fact-list">
          <div><span class="k">标准号</span><span class="v">{{ standard.number }}</span></div>
          <div><span class="k">性质</span><span class="v">{{ standard.kind }}</span></div>
          <div>
            <span class="k">状态</span>
            <span class="v ok-text">{{ standard.status }}</span>
          </div>
          <div><span class="k">发布</span><span class="v">{{ standard.issued }}</span></div>
          <div><span class="k">实施</span><span class="v">{{ standard.implemented }}</span></div>
          <div><span class="k">发布单位</span><span class="v">{{ standard.issuerAtPublication }}</span></div>
          <div><span class="k">现行主管部门</span><span class="v">{{ standard.competentDepartment }}</span></div>
          <div>
            <span class="k">代替</span>
            <span class="v">{{ standard.replaces.join('；') }}</span>
          </div>
          <div>
            <span class="k">上次复审</span>
            <span class="v">{{ standard.lastReview }}（结论：{{ standard.lastReviewConclusion }}）</span>
          </div>
          <div><span class="k">出版信息</span><span class="v">{{ standard.pagesNote }}</span></div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-title">第 1 号修改单</div>
      <div class="card" style="padding: 14px 16px; font-size: 0.88rem; line-height: 1.6">
        <p style="margin: 0 0 8px"><strong>{{ standard.amendment.number }}</strong>　{{ standard.amendment.title }}</p>
        <p style="margin: 0 0 8px">{{ standard.amendment.officialRemark }}</p>
        <p style="margin: 0 0 8px">{{ standard.amendment.dateNote }}</p>
        <p style="margin: 0">{{ standard.amendment.scopeNote }}</p>
        <p v-if="affected" style="margin: 10px 0 0">
          相关目录：
          <RouterLink class="link-out" :to="{ name: 'entry', params: { id: affected.id } }">
            {{ shortNumber(affected) }}　{{ affected.title }}
          </RouterLink>
        </p>
      </div>
    </section>

    <section class="section">
      <div class="section-title">修订动态（尚未替代现行标准）</div>
      <div class="card" style="padding: 14px 16px; font-size: 0.88rem; line-height: 1.6">
        <p style="margin: 0 0 8px">
          <strong>{{ standard.revisionPlan.number }}</strong>　{{ standard.revisionPlan.title }}
        </p>
        <p style="margin: 0 0 8px">
          下达日期 {{ standard.revisionPlan.issuedOn }}，项目周期 {{ standard.revisionPlan.period }}。
          平台进度（{{ standard.revisionPlan.checkedOn }}）：{{ standard.revisionPlan.status }}。
        </p>
        <p style="margin: 0">{{ standard.revisionPlan.note }}</p>
      </div>
    </section>

    <section class="section">
      <div class="section-title">官方与授权渠道</div>
      <div class="card" style="padding: 8px 16px">
        <div class="fact-list">
          <div>
            <span class="k">全文公开系统</span>
            <span class="v">
              <a class="link-out" :href="officialReadUrl" target="_blank" rel="noopener noreferrer">在线预览 / 官方下载入口</a>
            </span>
          </div>
          <div>
            <span class="k">标准信息平台</span>
            <span class="v">
              <a class="link-out" :href="standard.officialUrls.stdPlatform" target="_blank" rel="noopener noreferrer">题录、状态与复审信息</a>
            </span>
          </div>
          <div>
            <span class="k">修订计划</span>
            <span class="v">
              <a class="link-out" :href="standard.officialUrls.revisionPlan" target="_blank" rel="noopener noreferrer">20261386-Q-312</a>
            </span>
          </div>
          <div>
            <span class="k">标准出版社</span>
            <span class="v">
              <a class="link-out" :href="standard.officialUrls.spc" target="_blank" rel="noopener noreferrer">中国标准在线服务网（授权纸质/电子版）</a>
            </span>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-title">相关文件（仅书目）<span>不含正文</span></div>
      <div class="list-gap">
        <a
          v-for="doc in catalog.relatedDocs"
          :key="doc.id"
          class="doc-card"
          :href="doc.officialUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div class="kind">{{ doc.kind }} · {{ doc.status }}</div>
          <h3>{{ doc.number }}　{{ doc.title }}</h3>
          <p>{{ doc.note }}</p>
          <span class="link-out">打开官方页面</span>
        </a>
      </div>
    </section>

    <section class="section">
      <div class="section-title">版权与免责声明</div>
      <p class="disclaimer" style="margin: 0">{{ catalog.disclaimer }}</p>
    </section>
  </div>
</template>
