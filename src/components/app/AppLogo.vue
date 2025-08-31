<template>
  <div class="flex items-center gap-x-2">
    <!-- TODO: Replace with real logo -->
    <img
      src="/img/placeholder.webp"
      class="aspect-square h-8 w-auto rounded-full object-cover object-center"
      :alt="t('app.title')"
    />
    <!-- TODO: Maybe switch app name to svg? -->
    <div class="mt-1 hidden font-logo text-xl font-medium sm:block sm:text-3xl">
      <span class="text-primary">MOBI</span>
      <span class="text-secondary">METER</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
