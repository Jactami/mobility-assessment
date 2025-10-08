<template>
  <header
    class="border-outline-variant bg-surface-container-lowest text-on-surface sticky top-0 z-50 border-b shadow-sm"
  >
    <nav class="mx-auto flex h-14 items-center justify-between gap-x-6 px-4 sm:h-16 lg:px-10">
      <div class="flex lg:flex-1">
        <RouterLink to="/">
          <AppBrand />
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
import AppBrand from './AppBrand.vue'
import AppDarkModeButton from './AppDarkModeButton.vue'

const authStore = useAuthStore()
const { t } = useI18n()
</script>
