<template>
  <div
    class="rounded-border bg-surface-container-high animate-pulse"
    :class="{ 'rounded-full': rounded }"
    :style="style"
    aria-busy="true"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  width?: string
  height?: string
  rounded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '1rem',
})

const style = computed(() => `width: ${props.width}; height: ${props.height};`)
</script>
