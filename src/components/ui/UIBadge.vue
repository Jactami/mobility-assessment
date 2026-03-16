<template>
  <div
    class="inline-flex items-center justify-center gap-1 rounded-border px-2 py-1 text-xs font-medium tracking-wide"
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

type BadgeProps = {
  label?: string
  severity?: UISeverity
  // TODO: add icon support
  // TODO: add size variants
  // TODO: add variant (filled, ghost)
  // TODO: add custom classes
}

const props = withDefaults(defineProps<BadgeProps>(), {
  severity: 'none',
})

// TODO: Move color mapping to utility composable?
const severityClassMap: Record<UISeverity, string> = {
  primary: 'bg-primary text-on-primary',
  neutral: 'bg-surface-container text-on-surface-variant',
  success: 'bg-success text-on-success',
  warning: 'bg-warning text-on-warning',
  danger: 'bg-error text-on-error',
  none: '',
}

const severityClasses = computed(() =>
  props.severity ? severityClassMap[props.severity] : severityClassMap.none,
)
</script>
