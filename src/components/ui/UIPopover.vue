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
      <slot name="trigger">
        <!-- Trigger goes here -->
      </slot>
    </PopoverButton>

    <!-- Popover Content -->
    <Teleport v-if="isHovered" to="body">
      <PopoverPanel
        ref="floatingEl"
        class="absolute z-10 max-w-sm rounded-border bg-surface-inverse p-2 text-xs text-on-surface-inverse shadow-md"
        :style="floatingStyles"
        static
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
      >
        <div>
          <slot name="popover">
            <!-- Popover content goes here... -->
          </slot>
        </div>

        <!-- Triangle -->
        <div
          v-if="position === 'top'"
          class="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 border-t-5 border-r-5 border-l-5 border-t-surface-inverse border-r-transparent border-l-transparent"
        />
        <div
          v-else-if="position === 'bottom'"
          class="absolute bottom-full left-1/2 h-0 w-0 -translate-x-1/2 border-r-5 border-b-5 border-l-5 border-r-transparent border-b-surface-inverse border-l-transparent"
        />
        <div
          v-else-if="position === 'left'"
          class="absolute top-1/2 left-full h-0 w-0 -translate-y-1/2 border-t-5 border-b-5 border-l-5 border-t-transparent border-b-transparent border-l-surface-inverse"
        />
        <div
          v-else-if="position === 'right'"
          class="absolute top-1/2 right-full h-0 w-0 -translate-y-1/2 border-t-5 border-r-5 border-b-5 border-t-transparent border-r-surface-inverse border-b-transparent"
        />
      </PopoverPanel>
    </Teleport>
  </Popover>
</template>

<script setup lang="ts">
import { autoUpdate, offset, useFloating } from '@floating-ui/vue'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    position?: 'top' | 'bottom' | 'left' | 'right'
  }>(),
  {
    position: 'top',
  },
)

const referenceEl = ref<HTMLElement | null>(null)
const floatingEl = ref<HTMLElement | null>(null)

const isHovered = ref(false)

const { floatingStyles } = useFloating(referenceEl, floatingEl, {
  placement: props.position,
  middleware: [offset(5)],
  whileElementsMounted: autoUpdate,
})
</script>
