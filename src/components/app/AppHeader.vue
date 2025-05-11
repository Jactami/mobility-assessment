<template>
  <header class="bg-primary text-on-primary">
    <nav class="p-x-4 mx-auto flex items-center justify-between py-6 lg:px-10">
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

      <div class="flex flex-1 justify-end">
        <!-- TODO: create real user menu -->
        <span class="rounded-full bg-surface-container p-2 text-sm text-on-surface-variant">
          CB
        </span>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
