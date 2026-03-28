<template>
  <div
    class="inline-flex items-center justify-center rounded-border px-2 py-1 text-xs font-medium tracking-wide"
    :class="severityClasses"
  >
    <slot :label="label">
      {{ label }}
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { UISeverity } from './types'

// TODO: Use ButtonVariant type when created
type UIBadgeVariant = 'solid' | 'soft'

type BadgeProps = {
  label?: string
  severity?: UISeverity
  variant?: UIBadgeVariant
  // TODO: add icon support
  // TODO: add size variants
  // TODO: add shape modifier (rounded -> pill)
  // TODO: add custom classes
}

const props = withDefaults(defineProps<BadgeProps>(), {
  severity: 'none',
  variant: 'solid',
})

// TODO: Move color mapping to utility composable?
const severityClassMap: Record<UIBadgeVariant, Record<UISeverity, string>> = {
  solid: {
    primary: 'bg-primary text-on-primary',
    neutral: 'bg-surface-container text-on-surface-variant',
    success: 'bg-success text-on-success',
    warning: 'bg-warning text-on-warning',
    danger: 'bg-error text-on-error',
    none: '',
  },
  soft: {
    primary: 'bg-primary-container text-on-primary-container',
    neutral: 'bg-surface-container text-on-surface-variant',
    success: 'bg-success-container text-on-success-container',
    warning: 'bg-warning-container text-on-warning-container',
    danger: 'bg-error-container text-on-error-container',
    none: '',
  },
}

const severityClasses = computed(() =>
  props.severity
    ? severityClassMap[props.variant][props.severity]
    : severityClassMap[props.variant].none,
)
</script>
