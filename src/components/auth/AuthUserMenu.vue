<template>
  <UIMenu v-if="authStore.profile" :items="menu" position="bottom-end" strategy="fixed">
    <template #trigger>
      <UIButton
        severity="primary"
        class="rounded-full p-0 hover:outline-2 hover:outline-primary/50"
      >
        <AuthUserAvatar :profile="authStore.profile" />
      </UIButton>
    </template>
    <template #start>
      <div>
        <div class="text-base font-semibold">
          {{ authStore.profile?.first_name }} {{ authStore.profile?.last_name }}
        </div>
        <div class="mt-1 text-sm text-on-surface-variant">{{ authStore.profile?.email }}</div>
      </div>
    </template>
  </UIMenu>
</template>

<script setup lang="ts">
import UIButton from '@/components/ui/button/UIButton.vue'
import UIMenu from '@/components/ui/menu/UIMenu.vue'
import { useAuthService } from '@/composables/auth'
import { useNotification } from '@/composables/notification'
import { useAuthStore } from '@/stores/Auth'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import type { MenuListItem } from '../ui/menu/types'
import AuthUserAvatar from './AuthUserAvatar.vue'

const router = useRouter()
const authStore = useAuthStore()
const authService = useAuthService()
const { errorToast } = useNotification()
const { t } = useI18n()

const menu: MenuListItem[] = [
  {
    label: t('navigation.settings'),
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

async function handleSignOut() {
  // sign out user
  const { error } = await authService.signOut()

  // handle authentication errors
  if (error) {
    errorToast(t('auth.error.logout'))
    console.error(error)
    return
  }

  // redirect user to login page
  router.push({ name: 'login' })
}
</script>
