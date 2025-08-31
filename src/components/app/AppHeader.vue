<template>
  <header
    class="sticky top-0 z-10 border-b border-outline-variant bg-surface text-on-surface shadow-sm"
  >
    <nav class="mx-auto flex h-16 items-center justify-between px-4 lg:px-10">
      <div class="flex lg:flex-1">
        <RouterLink to="/">
          <AppLogo />
        </RouterLink>
      </div>

      <div class="flex flex-1 items-center justify-end gap-x-2">
        <AppDarkModeButton />
        <AuthUserAvatar v-if="authStore.user" />
        <RouterLink v-else to="/login">
          {{ t('auth.login') }}
        </RouterLink>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import AuthUserAvatar from '@/components/auth/AuthUserAvatar.vue'
import { useAuthStore } from '@/stores/Auth'
import { useI18n } from 'vue-i18n'
import AppDarkModeButton from './AppDarkModeButton.vue'
import AppLogo from './AppLogo.vue'

const authStore = useAuthStore()
const { t } = useI18n()
</script>
