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
  lg: 'px-3.5 py-2.5 text-base',
}

const shadowClasses = 'shadow-sm disabled:shadow-none'

const variantClasses: Record<
  NonNullable<ButtonProps['variant']>,
  Record<NonNullable<ButtonProps['severity']>, string>
> = {
  solid: {
    primary: `bg-primary text-on-primary enabled:hover:bg-primary/85 enabled:active:bg-primary/75 ${shadowClasses}`,
    neutral: `bg-surface-container text-on-surface-variant enabled:hover:bg-surface-container-high/90 enabled:active:bg-surface-container-high ${shadowClasses}`,
    danger: `bg-error text-on-error enabled:hover:bg-error/85 enabled:active:bg-error/75 ${shadowClasses}`,
  },
  ghost: {
    primary: 'text-primary enabled:hover:bg-primary/15 enabled:active:bg-primary/25',
    neutral:
      'text-on-surface  enabled:hover:bg-surface-container-high/90 enabled:active:bg-surface-container-high',
    danger: 'text-error enabled:hover:bg-error/15 enabled:active:bg-error/25',
  },
}

const focusClasses: Record<NonNullable<ButtonProps['severity']>, string> = {
  primary: 'focus-visible:ring-primary',
  neutral: 'focus-visible:ring-on-surface',
  danger: 'focus-visible:ring-error',
}

// TODO: Decide whether a 'transition active:scale-95' should be added to base classes.
const buttonClasses = computed(() =>
  twMerge([
    // base classes
    'relative inline-flex cursor-pointer transition-colors font-medium items-center justify-center gap-x-1 rounded-border',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:brightness-100 disabled:pointer-events-none',
    // prop classes
    focusClasses[props.severity],
    sizeClasses[props.size],
    variantClasses[props.variant!][props.severity!],
    props.class,
  ]),
)
</script>
