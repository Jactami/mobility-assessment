<template>
  <h1 class="text-4xl font-medium" :class="{ 'mb-10': !subtitle }">{{ title }}</h1>
  <p v-if="subtitle" class="mt-6 mb-10 text-lg text-on-surface-variant">{{ subtitle }}</p>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>
