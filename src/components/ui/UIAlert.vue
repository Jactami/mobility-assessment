<template>
  <div
    role="alert"
    aria-live="assertive"
    class="rounded-border px-6 py-4 shadow-sm"
    :class="[severityClasses]"
  >
    <h3 v-if="title" class="mb-3 text-sm font-semibold sm:text-base">
      {{ title }}
    </h3>
    <div class="text-xs sm:text-sm">
      <slot :message="message" :severity="severity">
        <p>
          {{ message }}
        </p>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { UISeverity } from './types'

const props = defineProps<{
  title?: string
  message?: string
  severity: UISeverity
}>()

// TODO: Add severity icons?

const severityClassMap: Record<UISeverity, string> = {
  primary: 'bg-primary-container text-on-primary-container',
  neutral: 'bg-surface-container text-on-surface-container',
  success: 'bg-success-container text-on-success-container',
  warning: 'bg-warning-container text-on-warning-container',
  danger: 'bg-error-container text-on-error-container',
  none: '',
}

const severityClasses = computed(() => severityClassMap[props.severity])
</script>
