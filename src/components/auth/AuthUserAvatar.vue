<template>
  <UIMenu v-if="authStore.profile" :items="menu" position="bottom-end">
    <template #trigger>
      <UIButton
        class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-mono font-medium text-on-primary shadow-none select-none hover:outline-2 hover:outline-primary/50"
      >
        {{ initials }}
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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import type { MenuListItem } from '../ui/menu/types'

const router = useRouter()
const authStore = useAuthStore()
const authService = useAuthService()
const { errorToast } = useNotification()
const { t } = useI18n()

const menu: MenuListItem[] = [
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
