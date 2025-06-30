<template>
  <BasePageHeader :title="t('settings.title')" />

  <BaseSection :title="t('auth.changePassword')" class="grow">
    <AuthChangePasswordForm />
  </BaseSection>

  <BaseSection :title="t('settings.appInfo')">
    <p class="text-sm">v{{ version }} ({{ new Date(buildDate).toISOString() }})</p>
  </BaseSection>
</template>

<script setup lang="ts">
import AuthChangePasswordForm from '@/components/auth/AuthChangePasswordForm.vue'
import BasePageHeader from '@/components/base/BasePageHeader.vue'
import BaseSection from '@/components/base/BaseSection.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Defined in vite.config.ts
const version = __APP_VERSION__
const buildDate = __APP_BUILD_DATE__
</script>
