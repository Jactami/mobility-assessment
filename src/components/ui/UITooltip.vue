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
        class="rounded-border bg-surface-inverse text-on-surface-inverse pointer-events-none absolute z-10 max-w-sm p-2 text-xs shadow-md"
        :style="floatingStyles"
        static
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
      >
        <div class="whitespace-pre-line text-pretty break-words text-center">
          {{ message }}
        </div>

        <!-- Triangle -->
        <div
          v-if="placement === 'top'"
          class="border-t-5 border-r-5 border-l-5 border-t-surface-inverse absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-l-transparent border-r-transparent"
        />
        <div
          v-else-if="placement === 'bottom'"
          class="border-r-5 border-b-5 border-l-5 border-b-surface-inverse absolute bottom-full left-1/2 h-0 w-0 -translate-x-1/2 border-l-transparent border-r-transparent"
        />
        <div
          v-else-if="placement === 'left'"
          class="border-t-5 border-b-5 border-l-5 border-l-surface-inverse absolute left-full top-1/2 h-0 w-0 -translate-y-1/2 border-b-transparent border-t-transparent"
        />
        <div
          v-else-if="placement === 'right'"
          class="border-t-5 border-r-5 border-b-5 border-r-surface-inverse absolute right-full top-1/2 h-0 w-0 -translate-y-1/2 border-b-transparent border-t-transparent"
        />
      </PopoverPanel>
    </Teleport>
  </Popover>
</template>

<script setup lang="ts">
import { autoUpdate, flip, offset, useFloating } from '@floating-ui/vue'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    message: string
    position?: 'top' | 'bottom' | 'left' | 'right'
  }>(),
  {
    position: 'top',
  },
)

const referenceEl = ref<HTMLElement | null>(null)
const floatingEl = ref<HTMLElement | null>(null)

const isHovered = ref(false)

const { floatingStyles, placement } = useFloating(referenceEl, floatingEl, {
  placement: props.position,
  middleware: [offset(5), flip()],
  whileElementsMounted: autoUpdate,
})
</script>
