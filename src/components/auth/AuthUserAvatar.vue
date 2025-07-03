<template>
  <MenuPopup v-if="authStore.profile" :menu="menu" placement="bottom-end">
    <template #trigger>
      <div
        class="flex aspect-square items-center justify-center rounded-full bg-surface p-1 font-medium text-on-surface-variant"
      >
        {{ initials }}
      </div>
    </template>
    <template #start>
      <div class="mb-2 p-2">
        <div class="text-lg font-semibold">
          {{ authStore.profile?.first_name }} {{ authStore.profile?.last_name }}
        </div>
        <div class="text-sm text-on-surface-variant">{{ authStore.profile?.email }}</div>
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
    label: t('settings.title'),
    icon: 'settings',
    action: () => router.push({ name: 'settings' }),
    divider: true,
  },
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
  // sign out user
  const { error } = await authService.signOut()

  // handle authentication errors
  if (error) {
    errorToast(t('auth.logoutError'))
    console.error(error)
    return
  }

  // redirect user to login page
  router.push({ name: 'login' })
}
</script>
