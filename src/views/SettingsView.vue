<template>
  <UIPageHeader :title="t('navigation.settings')" />

  <AuthUserStatusAlert />

  <UISection :title="t('auth.password.change')" class="grow">
    <AuthChangePasswordForm />
  </UISection>

  <UISection :title="t('app.info')">
    <div class="text-sm">
      <p>{{ t('app.version', { version, date: new Date(buildDate).toISOString() }) }}</p>
      <p>
        {{
          t('app.copyright', {
            app: t('app.title'),
            company: t('app.company.full'),
            year: new Date().getFullYear(),
          })
        }}
      </p>
    </div>
  </UISection>
</template>

<script setup lang="ts">
import AuthChangePasswordForm from '@/components/auth/AuthChangePasswordForm.vue'
import AuthUserStatusAlert from '@/components/auth/AuthUserStatusAlert.vue'
import UIPageHeader from '@/components/ui/UIPageHeader.vue'
import UISection from '@/components/ui/UISection.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Defined in vite.config.ts
const version = __APP_VERSION__
const buildDate = __APP_BUILD_DATE__
</script>
