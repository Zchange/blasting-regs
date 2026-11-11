import { createRouter, createWebHistory } from 'vue-router'
const HomeView = () => import('../views/HomeView.vue')
const SearchView = () => import('../views/SearchView.vue')
const TocView = () => import('../views/TocView.vue')
const EntryView = () => import('../views/EntryView.vue')
const ScenarioView = () => import('../views/ScenarioView.vue')
const ShortcutView = () => import('../views/ShortcutView.vue')
const InfoView = () => import('../views/InfoView.vue')
const MeView = () => import('../views/MeView.vue')
const PdfView = () => import('../views/PdfView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { tab: 'home' } },
    { path: '/search', name: 'search', component: SearchView, meta: { tab: 'home' } },
    { path: '/toc', name: 'toc', component: TocView, meta: { tab: 'toc' } },
    { path: '/entry/:id', name: 'entry', component: EntryView, meta: { tab: 'toc' } },
    { path: '/scenario/:id', name: 'scenario', component: ScenarioView, meta: { tab: 'home' } },
    { path: '/shortcut/:id', name: 'shortcut', component: ShortcutView, meta: { tab: 'home' } },
    { path: '/info', name: 'info', component: InfoView, meta: { tab: 'info' } },
    { path: '/me', name: 'me', component: MeView, meta: { tab: 'me' } },
    { path: '/pdf', name: 'pdf', component: PdfView, meta: { tab: 'me', hideTabbar: true } },
  ],
})

export default router
