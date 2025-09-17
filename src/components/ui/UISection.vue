<template>
  <section class="my-8">
    <header v-if="title" class="mt-4 mb-6">
      <h2 class="text-2xl leading-tight font-bold text-pretty">{{ title }}</h2>
    </header>
    <div>
      <slot>
        <!-- Section content goes here. -->
      </slot>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>
