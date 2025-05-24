<template>
  <MenuPopup v-if="authStore.profile" :menu="menu">
    <template #trigger>
      <div class="rounded-full bg-surface p-1 text-on-surface-variant">
        {{ initials }}
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
import { computed } from 'vue'
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

const initials = computed(
  () =>
    `${authStore.profile?.first_name?.charAt(0) || ''}${authStore.profile?.last_name?.charAt(0) || ''}`,
)

async function handleSignOut() {
  try {
    await authService.signOut()
    router.push({ name: 'login' })
  } catch {
    errorToast(t('auth.logoutError'))
  }
}
</script>
