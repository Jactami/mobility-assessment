import './assets/main.css'

import formkitConfig from '@/config/formkit/config'
import { defaultConfig, plugin } from '@formkit/vue'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n'
import router from './router'

const pinia = createPinia()

const app = createApp(App)

app.use(i18n)
app.use(router)
app.use(pinia)
app.use(plugin, defaultConfig(formkitConfig))

app.mount('#app')
