<template>
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <FormKit #default="{ state: { valid } }" type="form" :actions="false" @submit="handleSignIn">
      <FormKit
        id="email"
        type="email"
        :label="t('auth.email')"
        name="email"
        :placeholder="t('auth.email')"
        validation="required|email"
        autocomplete="email"
        autofocus
      />
      <FormKit
        id="password"
        type="password"
        :label="t('auth.password')"
        name="password"
        :placeholder="t('auth.password')"
        validation="required"
      />
      <BaseButton type="submit" class="w-full" :disabled="!valid">Login</BaseButton>
    </FormKit>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import { useLogger } from '@/composables/log'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

function handleSignIn(data: unknown) {
  useLogger().log('TODO: sign in', data)
}
</script>
