<template>
  <!-- TODO: Decide if IconButton should extend BaseButton or made from scratch. -->
  <BaseButton
    flavor="custom"
    classes="aspect-square rounded-full p-0.5 shadow-none hover:bg-surface-container-highest hover:shadow-none hover:brightness-100 disabled:bg-surface-container-lowest disabled:shadow-none disabled:bg-transparent"
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
