<template>
  <header class="my-6">
    <h1 class="text-3xl leading-tight font-bold text-pretty sm:text-4xl">{{ title }}</h1>
    <div v-if="subtitle" class="mt-4 text-lg text-pretty text-on-surface-variant">
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
