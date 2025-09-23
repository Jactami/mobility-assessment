<template>
  <button :type="type" :title="title" :disabled="disabled">
    <slot>
      <!-- Button content goes here... -->
    </slot>
  </button>
</template>

<script setup lang="ts">
/**
 * Abstract button base component.
 * This component serves as a foundational element for building various button types.
 * It encapsulates common button behaviors and styles, ensuring consistency across the application.
 * It is not intended to be used directly in the UI.
 */

import type { ButtonProps } from '../types'

withDefaults(defineProps<ButtonProps>(), {
  type: 'button',
  disabled: false,
  tooltip: undefined,
})
</script>
