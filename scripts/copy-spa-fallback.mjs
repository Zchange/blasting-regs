import { copyFileSync } from 'node:fs'

// GitHub Pages has no SPA rewrite. A copy of the app shell at 404.html
// is served for unknown paths such as /blasting-regs/toc, and Vue Router
// reads the real URL from createWebHistory(import.meta.env.BASE_URL).
copyFileSync(new URL('../dist/index.html', import.meta.url), new URL('../dist/404.html', import.meta.url))
console.log('SPA fallback: copied dist/index.html to dist/404.html')
