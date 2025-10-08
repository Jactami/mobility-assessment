<template>
  <div
    class="rounded-border border-outline-variant bg-surface-container-lowest group size-full overflow-hidden border shadow"
    :class="{
      'transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg': animation,
    }"
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
