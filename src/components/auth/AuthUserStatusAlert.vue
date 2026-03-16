<template>
  <div v-if="alert" class="mb-8">
    <UIAlert :severity="alert.severity" :title="alert.title" :message="alert.message" />
  </div>
</template>

<script setup lang="ts">
import type { UISeverity } from '@/components/ui/types'
import UIAlert from '@/components/ui/UIAlert.vue'
import { useAuthStore } from '@/stores/Auth'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const authStore = useAuthStore()
const { d, t } = useI18n()

const alert = computed<{ severity: UISeverity; title: string; message: string } | null>(() => {
  const profile = authStore.profile

  if (!profile) return null

  // Account is disabled by admin
  if (profile.is_disabled) {
    return {
      severity: 'danger',
      title: t('alert.accountDisabled.title'),
      message: t('alert.accountDisabled.message'),
    }
  }

  // Account has exceeded its expiration date
  if (authStore.isExpired) {
    return {
      severity: 'danger',
      title: t('alert.accountExpired.title'),
      message: t('alert.accountExpired.message'),
    }
  }

  // Account will expire in the future
  if (profile.expires_at) {
    return {
      severity: 'warning',
      title: t('alert.accountExpiresSoon.title'),
      message: t('alert.accountExpiresSoon.message', {
        date: d(new Date(profile.expires_at), 'short'),
      }),
    }
  }

  // Account is active and has no expiration date
  return null
})
</script>
