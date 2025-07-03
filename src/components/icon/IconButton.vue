<template>
  <!-- TODO: Decide if IconButton should extend BaseButton or made from scratch. -->
  <BaseButton
    flavor="custom"
    class="aspect-square rounded-full p-1.5 shadow-none hover:bg-surface-container-highest hover:shadow-none hover:brightness-100 disabled:bg-transparent disabled:shadow-none"
    :disabled="disabled"
    :title="title"
  >
    <IconRenderer :icon="icon" />
  </BaseButton>
</template>

<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import IconRenderer from './IconRenderer.vue'
import type { Icon } from './types'

defineProps<{
  icon: Icon
  disabled?: boolean
  title?: string
}>()
</script>
