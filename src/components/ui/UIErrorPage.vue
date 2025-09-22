<template>
  <div class="flex h-full w-full grow flex-col items-center justify-center p-6 text-center">
    <UIIcon icon="error" class="text-error size-12 sm:size-16" />

    <h2 class="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
      {{ title }}
    </h2>

    <p class="text-on-surface-variant mt-6 max-w-md text-pretty text-base font-medium sm:text-xl">
      {{ message }}
    </p>

    <div class="mt-10">
      <UIButton @click="emit('retry')" variant="error">{{ t('common.retry') }}</UIButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import UIButton from './button/UIButton.vue'
import UIIcon from './icon/UIIcon.vue'

defineProps<{
  title: string
  message: string
}>()

const emit = defineEmits<{
  (e: 'retry'): void
}>()

const { t } = useI18n()
</script>
