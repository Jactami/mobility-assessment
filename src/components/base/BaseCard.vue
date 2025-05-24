<template>
  <div
    class="group size-full rounded border border-outline-variant shadow"
    :class="{ 'transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg': animation }"
  >
    <slot>
      <!-- Card content goes here. -->
    </slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  animation?: boolean
}>()
</script>
