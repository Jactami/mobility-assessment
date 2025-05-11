<template>
  <button
    ref="reference"
    class="size-fit cursor-pointer rounded-md border border-outline-variant p-1 hover:bg-surface-container"
    :class="{ 'bg-surface-container': isOpen }"
    @click.prevent="isOpen = !isOpen"
    @keydown.escape="isOpen = false"
  >
    <MaterialSymbolsMoreVert aria-hidden="true" />
  </button>
  <MenuPanel v-if="isOpen" ref="floating" :menu="menu" class="shadow" :style="floatingStyles" />
</template>

<script setup lang="ts">
import MaterialSymbolsMoreVert from '~icons/material-symbols/more-vert'
import { ref } from 'vue'
import { useFloating, autoUpdate, flip, offset } from '@floating-ui/vue'
import type { Menu } from './types'
import MenuPanel from './MenuPanel.vue'
import { onClickOutside } from '@vueuse/core'

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
