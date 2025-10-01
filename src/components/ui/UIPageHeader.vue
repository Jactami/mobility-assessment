<template>
  <header class="my-6">
    <h1 class="text-pretty text-3xl font-bold leading-tight sm:text-4xl">{{ title }}</h1>
    <div v-if="subtitle" class="text-on-surface-muted mt-3 text-pretty text-lg font-medium">
      {{ subtitle }}
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>
