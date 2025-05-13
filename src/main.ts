import './assets/main.css'

import formkitConfig from '@/config/formkit/config'
import { defaultConfig, plugin } from '@formkit/vue'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import { supabase } from './db'
import i18n from './i18n'
import router from './router'
import { useAuthStore } from './stores/Auth'

const pinia = createPinia()

const app = createApp(App)

app.use(i18n)
app.use(router)
app.use(pinia)
app.use(plugin, defaultConfig(formkitConfig))

app.mount('#app')

/**
 * Auth event listener to update and set initial auth data.
 * This will be triggered on page load and when the user logs in or out.
 * It mitigates the need to have a persistent pinia store for auth data.
 *
 * TODO: Move this to different module. authStore must be called after pinia is registered!
 */
supabase.auth.onAuthStateChange((_, session) => {
  useAuthStore().setUser(session?.user || null)
})
