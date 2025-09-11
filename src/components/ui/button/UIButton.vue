<template>
  <UIButtonBase
    :type="type"
    :title="title"
    :disabled="disabled"
    :tooltip="tooltip"
    :class="btnClass"
  >
    <slot>
      <!-- Button content goes here... -->
    </slot>
  </UIButtonBase>
</template>

<script setup lang="ts">
import { twMerge } from 'tailwind-merge'
import { computed } from 'vue'
import UIButtonBase from './elements/UIButtonBase.vue'
import type { ButtonProps } from './types'

type Props = ButtonProps & {
  size?: 'small' | 'normal' | 'large'
  variant?: 'primary' | 'secondary' | 'tertiary' | 'custom'
  class?: string // additional (tailwind) classes
}

const props = withDefaults(defineProps<Props>(), {
  size: 'normal',
  variant: 'primary',
  class: '',
})

const variantClass: Record<Exclude<Props['variant'], undefined>, string> = {
  primary: 'bg-primary text-on-primary focus:outline-primary',
  secondary: 'bg-secondary text-on-secondary focus-visible:outline-secondary',
  tertiary: 'bg-tertiary text-on-tertiary focus-visible:outline-tertiary',
  custom: '',
}

const sizeClass: Record<Exclude<Props['size'], undefined>, string> = {
  small: 'text-sm px-2.5 py-1.5',
  normal: 'text-base px-3.5 py-2.5',
  large: 'text-lg px-4 py-3',
}

/**
 * Generated button classes based on the flavor and size props and passed classes.
 */
const btnClass = computed(() => {
  return twMerge([
    'relative inline-flex w-fit cursor-pointer items-center justify-center gap-x-2 rounded-border shadow-sm hover:shadow-md hover:brightness-125 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:brightness-100',
    variantClass[props.variant],
    sizeClass[props.size],
    props.class,
  ])
})
</script>
