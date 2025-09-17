<template>
  <UISkeleton v-if="loading" :width="width" :height="height" v-bind="$attrs" />
  <slot v-else>
    <!-- Loaded content goes here... -->
  </slot>
</template>

<script setup lang="ts">
import UISkeleton from './UISkeleton.vue'

defineProps<{
  width?: string
  height?: string
  loading: boolean
}>()

defineOptions({ inheritAttrs: false })
</script>
