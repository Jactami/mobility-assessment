<template>
  <button
    ref="reference"
    class="size-fit cursor-pointer rounded-md p-1 hover:bg-surface-container"
    :class="{ 'bg-surface-container': isOpen }"
    aria-haspopup="menu"
    :aria-expanded="isOpen ? 'true' : 'false'"
    @click.prevent="isOpen = !isOpen"
    @keydown.escape="isOpen = false"
  >
    <slot name="trigger">
      <!-- Fallback trigger -->
      <MaterialSymbolsMoreVert aria-hidden="true" />
    </slot>
  </button>
  <MenuPanel
    v-if="isOpen"
    ref="floating"
    :menu="menu"
    class="shadow"
    :style="floatingStyles"
    role="menu"
    tabindex="-1"
  />
</template>

<script setup lang="ts">
import { autoUpdate, flip, offset, useFloating } from '@floating-ui/vue'
import { onClickOutside } from '@vueuse/core'
import { ref } from 'vue'
import MaterialSymbolsMoreVert from '~icons/material-symbols/more-vert'
import MenuPanel from './MenuPanel.vue'
import type { Menu } from './types'

defineProps<{
  menu: Menu
}>()

const isOpen = ref(false)

const reference = ref(null)
const floating = ref(null)

const { floatingStyles } = useFloating(reference, floating, {
  placement: 'right-start',
  middleware: [offset(2), flip()],
  whileElementsMounted: autoUpdate,
})

onClickOutside(reference, () => (isOpen.value = false))
</script>
