<template>
  <button
    :type="type"
    :class="buttonClasses"
    :title="title"
    :aria-label="ariaLabel || title"
    :disabled="disabled"
  >
    <slot name="icon">
      <!-- Fallback for icon slot -->
      <UIIcon v-if="icon" :icon="icon" />
    </slot>

    <slot>
      <!-- Button content goes here... -->
    </slot>
  </button>
</template>

<script setup lang="ts">
import { twMerge } from 'tailwind-merge'
import { computed } from 'vue'
import UIIcon from '../icon/UIIcon.vue'
import type { ButtonProps } from './types'

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'solid',
  severity: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
})

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-2.5 py-1.5 text-xs sm:text-sm',
  md: 'px-3 py-2 text-sm sm:text-base',
  lg: 'px-3.5 py-2.5 text-sm sm:text-base',
}

const shadowClasses = 'shadow-sm disabled:shadow-none'

const variantClasses: Record<
  NonNullable<ButtonProps['variant']>,
  Record<NonNullable<ButtonProps['severity']>, string>
> = {
  solid: {
    primary: `bg-primary text-on-primary disabled:bg-primary hover:bg-primary/85 active:bg-primary/75 ${shadowClasses}`,
    neutral: `bg-surface-container text-on-surface-variant disabled:bg-surface-container hover:bg-surface-container-high/90 active:bg-surface-container-high ${shadowClasses}`,
    danger: `bg-error text-on-error disabled:bg-error hover:bg-error/85 active:bg-error/75 ${shadowClasses}`,
  },
  ghost: {
    primary: 'text-primary disabled:bg-transparent hover:bg-primary/15 active:bg-primary/25',
    neutral:
      'text-on-surface disabled:bg-transparent hover:bg-surface-container-high/90 active:bg-surface-container-high',
    danger: 'text-error disabled:bg-transparent hover:bg-error/15 active:bg-error/25',
  },
}

const focusClasses: Record<NonNullable<ButtonProps['severity']>, string> = {
  primary: 'focus-visible:ring-primary',
  neutral: 'focus-visible:ring-on-surface',
  danger: 'focus-visible:ring-error',
}

const buttonClasses = computed(() =>
  twMerge([
    // base classes
    'relative inline-flex cursor-pointer transition-colors font-medium items-center justify-center gap-x-1 rounded-border',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:brightness-100',
    // prop classes
    focusClasses[props.severity],
    sizeClasses[props.size],
    variantClasses[props.variant!][props.severity!],
    props.class,
  ]),
)
</script>
