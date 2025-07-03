<template>
  <button
    ref="reference"
    class="size-fit cursor-pointer rounded-border p-1 hover:bg-surface-container"
    :class="{ 'bg-surface-container': isOpen }"
    aria-haspopup="menu"
    :aria-expanded="isOpen ? 'true' : 'false'"
    @click.prevent="isOpen = !isOpen"
    @keydown.escape="isOpen = false"
  >
    <slot name="trigger">
      <!-- Fallback trigger -->
      <IconRenderer icon="more" />
    </slot>
  </button>
  <Teleport to="body">
    <MenuPanel
      v-if="isOpen"
      ref="floating"
      :menu="menu"
      class="absolute shadow"
      :style="floatingStyles"
      role="menu"
      tabindex="-1"
    >
      <template #start>
        <slot name="start">
          <!-- Content before the menu items goes here. -->
        </slot>
      </template>
      <template #end>
        <slot name="end">
          <!-- Content after the menu items goes here. -->
        </slot>
      </template>
    </MenuPanel>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * TODO: Decide if we want to use the `Menu` component from `@headlessui/vue` instead.
 */
import IconRenderer from '@/components/icon/IconRenderer.vue'
import { autoUpdate, flip, offset, useFloating, type Placement } from '@floating-ui/vue'
import { onClickOutside } from '@vueuse/core'
import { ref } from 'vue'
import MenuPanel from './MenuPanel.vue'
import type { Menu } from './types'

interface Props {
  menu: Menu
  placement?: Placement
}

const props = withDefaults(defineProps<Props>(), {
  placement: 'right-start',
})
const isOpen = ref(false)

const reference = ref(null)
const floating = ref(null)

const { floatingStyles } = useFloating(reference, floating, {
  placement: props.placement,
  middleware: [offset(4), flip()],
  whileElementsMounted: autoUpdate,
})

onClickOutside(reference, () => (isOpen.value = false))
</script>
