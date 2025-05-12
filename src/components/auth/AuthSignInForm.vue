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
        :type="passwordVisible ? 'text' : 'password'"
        :label="t('auth.password')"
        name="password"
        :placeholder="t('auth.password')"
        validation="required"
      >
        <template #suffix>
          <button
            type="button"
            tabindex="-1"
            class="cursor-pointer p-0.5 hover:text-primary"
            @mousedown="passwordVisible = true"
            @mouseup="passwordVisible = false"
          >
            <MaterialSymbolsVisibilityOffOutlineRounded v-if="passwordVisible" aria-hidden="true" />
            <MaterialSymbolsVisibilityOutlineRounded v-else aria-hidden="true" />
          </button>
        </template>
      </FormKit>
      <BaseButton type="submit" classes="w-full" :disabled="!valid">
        {{ t('auth.login') }}
      </BaseButton>
    </FormKit>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import { useLogger } from '@/composables/log'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import MaterialSymbolsVisibilityOffOutlineRounded from '~icons/material-symbols/visibility-off-outline-rounded'
import MaterialSymbolsVisibilityOutlineRounded from '~icons/material-symbols/visibility-outline-rounded'

const { t } = useI18n()

const passwordVisible = ref(false)

function handleSignIn(data: unknown) {
  useLogger().log('TODO: sign in', data)
}
</script>
