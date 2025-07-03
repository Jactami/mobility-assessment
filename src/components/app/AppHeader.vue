<template>
  <header class="bg-primary text-on-primary">
    <nav class="mx-auto flex h-16 items-center justify-between px-4 lg:px-10">
      <div class="flex lg:flex-1">
        <RouterLink class="flex items-center gap-x-2" to="/">
          <!-- TODO: Replace with real logo -->
          <img
            src="/img/placeholder.webp"
            class="aspect-square h-8 w-auto rounded-full object-cover object-center"
            :alt="t('app.title')"
          />
          <span class="hidden text-lg sm:block sm:text-2xl">{{ t('app.title') }}</span>
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

const authStore = useAuthStore()
const { t } = useI18n()
</script>
