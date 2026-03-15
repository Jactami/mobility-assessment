<template>
  <div class="rounded-border p-1 text-xs font-medium" :class="severityClasses">
    <slot :label="label">
      {{ label }}
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Severity = 'primary' | 'neutral' | 'success' | 'warning' | 'danger' | 'none'

const props = defineProps<{
  label?: string
  severity?: Severity
  // TODO: add icon support
  // TODO: add size variants
  // TODO: add custom classes
}>()

const severityClassMap: Record<Severity, string> = {
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
