<template>
  <UIButton v-bind="props" :class="btnClass" />
</template>

<script setup lang="ts">
/**
 * Wrapper class around UIButton with default settings to display an icon-only button
 * with ghost variant and neutral severity.
 */
import { twMerge } from 'tailwind-merge'
import { computed } from 'vue'
import type { ButtonProps } from './types'
import UIButton from './UIButton.vue'

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'ghost',
  severity: 'neutral',
  size: 'md',
})

const btnClass = computed(() =>
  twMerge([
    // modify default button classes to make it an icon-only button
    'aspect-square rounded-full p-1.5 focus-visible:ring-offset-0',
    // prop classes
    props.class,
  ]),
)
</script>
