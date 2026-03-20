<template>
  <Popover class="relative">
    <!-- Trigger Element -->
    <PopoverButton
      ref="referenceEl"
      as="div"
      class="inline-block"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <slot>
        <!-- Trigger goes here -->
      </slot>
    </PopoverButton>

    <!-- Popover Content -->
    <Teleport v-if="isHovered" to="body">
      <PopoverPanel
        ref="floatingEl"
        as="div"
        class="pointer-events-none absolute z-10 max-w-sm rounded-border bg-surface-inverse p-2 text-xs text-on-surface-inverse shadow-md"
        :style="floatingStyles"
        static
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
      >
        <div
          class="overflow-hidden text-center text-pretty wrap-break-word text-ellipsis whitespace-pre-line"
        >
          {{ message }}
        </div>
      </PopoverPanel>
    </Teleport>
  </Popover>
</template>

<script setup lang="ts">
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { ref, useTemplateRef } from 'vue'

const props = withDefaults(
  defineProps<{
    message: string
    position?: 'top' | 'bottom' | 'left' | 'right'
  }>(),
  {
    position: 'top',
  },
)

const referenceEl = useTemplateRef<HTMLElement>('referenceEl')
const floatingEl = useTemplateRef<HTMLElement>('floatingEl')

const isHovered = ref(false)

const { floatingStyles } = useFloating(referenceEl, floatingEl, {
  placement: props.position,
  middleware: [
    offset(5), // Space between reference and floating element
    flip(), // Flip vertical/horizontal to keep in viewport
    shift({ padding: 8 }), // Shift to side to keep in viewport
  ],
  whileElementsMounted: autoUpdate,
})
</script>
