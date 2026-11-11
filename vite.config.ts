import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/blasting-regs/',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      // Service worker registration scope. Manifest scope/start_url are set below.
      scope: '/blasting-regs/',
      includeAssets: [
        'favicon.svg',
        'apple-touch-icon.png',
        'icons/icon-192.png',
        'icons/icon-512.png',
        'icons/icon-512-maskable.png',
      ],
      manifest: {
        name: '爆破安全规程查询',
        short_name: '爆破规程',
        description: 'GB 6722-2014《爆破安全规程》目录与场景导航（不含规程正文）',
        lang: 'zh-CN',
        theme_color: '#16324f',
        background_color: '#f3efe6',
        display: 'standalone',
        scope: '/blasting-regs/',
        start_url: '/blasting-regs/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,json,txt}'],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: true,
  },
})
