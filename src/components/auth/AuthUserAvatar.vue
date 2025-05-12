<template>
  <MenuPopup v-if="authStore.user" :menu="menu">
    <template #trigger>
      <div class="rounded-full bg-surface p-1 text-on-surface-variant">
        {{ authStore.user.email }}
      </div>
    </template>
  </MenuPopup>
</template>

<script setup lang="ts">
import MenuPopup from '@/components/menu/MenuPopup.vue'
import type { Menu } from '@/components/menu/types'
import { useAuthService } from '@/composables/auth'
import { useNotification } from '@/composables/notification'
import { useAuthStore } from '@/stores/Auth'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const authService = useAuthService()
const { errorToast } = useNotification()
const { t } = useI18n()

const menu: Menu = [
  {
    label: t('auth.logout'),
    icon: 'signOut',
    action: handleSignOut,
  },
]

async function handleSignOut() {
  try {
    await authService.signOut()
    router.push({ name: 'login' })
  } catch {
    errorToast(t('auth.logoutError'))
  }
}
</script>
