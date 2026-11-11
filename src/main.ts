import { createApp } from 'vue'
import {
  Button,
  Collapse,
  CollapseItem,
  ConfigProvider,
  Empty,
  Icon,
  NavBar,
  Search,
  Tabbar,
  TabbarItem,
  Toast,
  Dialog,
} from 'vant'
import 'vant/lib/index.css'
import App from './App.vue'
import router from './router'
import { applyStoredFontSize } from './lib/storage'
import { registerSW } from 'virtual:pwa-register'
import './styles/global.css'

applyStoredFontSize()
if (import.meta.env.PROD) registerSW({ immediate: true })

const app = createApp(App)
app.use(router)
app.use(ConfigProvider)
app.use(Button)
app.use(Collapse)
app.use(CollapseItem)
app.use(Empty)
app.use(Icon)
app.use(NavBar)
app.use(Search)
app.use(Tabbar)
app.use(TabbarItem)
app.use(Toast)
app.use(Dialog)
app.mount('#app')
