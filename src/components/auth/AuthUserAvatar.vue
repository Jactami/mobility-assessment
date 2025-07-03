<template>
  <MenuPopup v-if="authStore.profile" :items="menu" placement="bottom-end">
    <template #trigger>
      <BaseButton
        class="flex aspect-square items-center justify-center rounded-full bg-primary p-1.5 font-medium text-on-primary shadow-none hover:outline-2 hover:outline-primary/50"
      >
        {{ initials }}
      </BaseButton>
    </template>
    <template #start>
      <div>
        <div class="text-lg font-semibold">
          {{ authStore.profile?.first_name }} {{ authStore.profile?.last_name }}
        </div>
        <div class="text-sm text-on-surface-variant">{{ authStore.profile?.email }}</div>
      </div>
    </template>
  </MenuPopup>
</template>

<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import MenuPopup from '@/components/menu/MenuPopup.vue'
import type { MenuActionItem } from '@/components/menu/types'
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

const menu: MenuActionItem[] = [
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
