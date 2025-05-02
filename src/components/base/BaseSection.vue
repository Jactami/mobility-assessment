<template>
  <section>
    <h2 v-if="title" class="mt-6 text-xl font-bold">{{ title }}</h2>
    <div class="pt-4 pb-8">
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
