<template>
  <!-- Button with tooltip -->
  <UIPopover v-if="tooltip" :position="tooltip.position">
    <template #trigger>
      <button v-bind="$attrs" :type="type" :title="title" :disabled="disabled">
        <slot>
          <!-- Button content goes here... -->
        </slot>
      </button>
    </template>

    <template #popover>
      {{ tooltip.content }}
    </template>
  </UIPopover>

  <!-- Button without tooltip -->
  <button v-else v-bind="$attrs" :type="type" :title="title" :disabled="disabled">
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

import UIPopover from '../../UIPopover.vue'
import type { ButtonProps } from '../types'

// Ensure that the component does not inherit classes from the parent at root level.
defineOptions({ inheritAttrs: false })

withDefaults(defineProps<ButtonProps>(), {
  type: 'button',
  disabled: false,
  tooltip: undefined,
})
</script>
