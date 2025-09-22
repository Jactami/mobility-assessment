<template>
  <div class="flex items-center gap-x-0.5">
    <img src="/logo.svg" :alt="t('app.title')" class="h-10 w-auto" aria-hidden="true" />
    <div class="font-logo mt-1 text-2xl font-medium sm:text-3xl">
      <span class="text-primary">MOBI</span>
      <span class="text-secondary">METER</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
