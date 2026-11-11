# 爆破安全规程查询

中文、移动优先的 PWA，用于检索和浏览 GB 6722-2014《爆破安全规程》的**公开书目目录、场景入口与别名**。应用**不收录规程正文、公式、限值表或修改单条文**。

线上地址：<https://zchange.github.io/blasting-regs/>

条款原文在[国家标准全文公开系统](https://openstd.samr.gov.cn/bzgk/std/newGbInfo?hcno=B5C47C47122DC805A42E0244B43365C1)阅读。本仓库只保留目录元数据、标签、别名、官方链接和免责声明。也可在「我的」中导入您合法取得的 PDF（仅本机打开，不上传）。

## 本地运行

在仓库根目录：

```bash
npm install
npm run dev
```

开发预览：<http://127.0.0.1:5173/blasting-regs/>（监听 `0.0.0.0:5173`）。Vite `base` 为 `/blasting-regs/`，与 GitHub Pages 项目站点路径一致。

生产构建与预览：

```bash
npm run build
npm run preview
```

生产预览：<http://127.0.0.1:4173/blasting-regs/>。`npm run build` 会在构建后把 `dist/index.html` 复制为 `dist/404.html`，供 GitHub Pages 在没有路径重写时回退到单页应用。离线缓存在生产构建并通过 HTTPS 或 localhost 访问时生效。

校验目录数据：

```bash
npm test
```

## 说明

- 目录只到公开书目中的「节」，不编造条标题。
- 不做安全距离或药量计算器。
- GA 53/990/991 与《民用爆炸物品安全管理条例》仅提供官方书目链接。
- 官方条款正文在国家标准全文公开系统阅读，不在本应用内提供。
