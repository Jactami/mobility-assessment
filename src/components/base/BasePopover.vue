<template>
  <Popover class="relative">
    <!-- Trigger Element -->
    <PopoverButton
      ref="reference"
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
        ref="floating"
        class="absolute z-10 max-w-sm rounded-border bg-surface-inverse p-2 text-xs text-on-surface-inverse shadow-md"
        :style="floatingStyles"
        static
      >
        <span>
          {{ message }}
        </span>

        <!-- Bottom Triangle -->
        <div
          class="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 border-t-5 border-r-5 border-l-5 border-t-surface-inverse border-r-transparent border-l-transparent"
        />
      </PopoverPanel>
    </Teleport>
  </Popover>
</template>

<script setup lang="ts">
import { autoUpdate, offset, useFloating } from '@floating-ui/vue'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { ref } from 'vue'

defineProps<{
  message: string
}>()

const isHovered = ref(false)

const reference = ref(null)
const floating = ref(null)

const { floatingStyles } = useFloating(reference, floating, {
  placement: 'top',
  middleware: [offset(5)],
  whileElementsMounted: autoUpdate,
})
</script>
