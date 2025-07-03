<template>
  <div
    class="z-50 w-min max-w-md min-w-64 rounded-border border border-outline-variant bg-surface p-1 text-on-surface"
  >
    <slot name="start">
      <!-- Content before the menu items goes here. -->
    </slot>
    <ul class="list-none" role="menu">
      <li v-for="item in menu" :key="item.label">
        <component
          :is="item.link && !item.disabled ? 'RouterLink' : 'div'"
          class="flex items-center gap-x-1 rounded-md px-2 py-1"
          :to="item.link"
          :class="{
            'cursor-pointer hover:bg-surface-container':
              (item.action || item.link) && !item.disabled,
            'cursor-not-allowed opacity-50': item.disabled,
          }"
          role="menuitem"
          :aria-disabled="item.disabled ? 'true' : 'false'"
          :tabindex="(item.action || item.link) && !item.disabled ? 0 : undefined"
          @click.prevent="handleAction(item)"
          @keydown.enter.space.capture="handleAction(item)"
        >
          <IconRenderer :icon="item.icon" />
          <span>
            {{ item.label }}
          </span>
        </component>
        <hr v-if="item.divider" class="my-1 border-outline-variant" />
      </li>
    </ul>
    <slot name="end">
      <!-- Content after the menu items goes here. -->
    </slot>
  </div>
</template>

<script setup lang="ts">
import IconRenderer from '@/components/icon/IconRenderer.vue'
import type { Menu, MenuItem } from './types'

defineProps<{
  menu: Menu
}>()

function handleAction(item: MenuItem) {
  if (item.disabled) return
  if (!item.action) return

  item.action()
}
</script>
