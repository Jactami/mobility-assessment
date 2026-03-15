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
import type { UISeverity } from '../types'
import type { ButtonProps, ButtonSize, ButtonVariant } from './types'

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'solid',
  severity: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
})

// TODO: Create utility composable for for mapping ui types to Tailwind classes?

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-2.5 py-1.5 text-xs sm:text-sm',
  md: 'px-3 py-2 text-sm sm:text-base',
  lg: 'px-3.5 py-2.5 text-base',
}

const shadowClasses: Record<ButtonVariant, string> = {
  solid: 'shadow-sm disabled:shadow-none',
  ghost: '',
}

const variantClasses: Record<ButtonVariant, Record<UISeverity, string>> = {
  solid: {
    primary: `bg-primary text-on-primary enabled:hover:bg-primary/85 enabled:active:bg-primary/75`,
    neutral: `bg-surface-container text-on-surface-variant enabled:hover:bg-surface-container-high/90 enabled:active:bg-surface-container-high`,
    success: `bg-success text-on-success enabled:hover:bg-success/85 enabled:active:bg-success/75`,
    danger: `bg-error text-on-error enabled:hover:bg-error/85 enabled:active:bg-error/75`,
    warning: `bg-warning text-on-warning enabled:hover:bg-warning/85 enabled:active:bg-warning/75`,
    none: '',
  },
  ghost: {
    primary: 'text-primary enabled:hover:bg-primary/15 enabled:active:bg-primary/25',
    neutral:
      'text-on-surface-variant enabled:hover:bg-surface-container-high/90 enabled:active:bg-surface-container-high',
    success: 'text-success enabled:hover:bg-success/15 enabled:active:bg-success/25',
    danger: 'text-error enabled:hover:bg-error/15 enabled:active:bg-error/25',
    warning: 'text-warning enabled:hover:bg-warning/15 enabled:active:bg-warning/25',
    none: '',
  },
}

const focusClasses: Record<UISeverity, string> = {
  primary: 'focus-visible:ring-primary',
  neutral: 'focus-visible:ring-on-surface-variant',
  danger: 'focus-visible:ring-error',
  success: 'focus-visible:ring-success',
  warning: 'focus-visible:ring-warning',
  none: '',
}

// TODO: Decide whether a 'transition active:scale-95' should be added to base classes.
const buttonClasses = computed(() =>
  twMerge([
    // base classes
    'relative inline-flex cursor-pointer transition-colors font-medium items-center justify-center gap-x-1 rounded-border',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:brightness-100',
    // prop classes
    focusClasses[props.severity],
    sizeClasses[props.size],
    shadowClasses[props.variant],
    variantClasses[props.variant!][props.severity!],
    props.class,
  ]),
)
</script>
