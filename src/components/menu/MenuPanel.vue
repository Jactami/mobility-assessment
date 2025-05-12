<template>
  <div
    class="z-50 w-full max-w-56 rounded-md border border-outline-variant bg-surface p-1 text-on-surface"
  >
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
          <component v-if="iconMap[item.icon]" :is="iconMap[item.icon]" />
          <span>
            {{ item.label }}
          </span>
        </component>
        <hr v-if="item.divider" class="my-1 border-outline-variant" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { FunctionalComponent } from 'vue'
import MaterialSymbolsAddCircleOutline from '~icons/material-symbols/add-circle-outline'
import MaterialSymbolsDeleteOutlineRounded from '~icons/material-symbols/delete-outline-rounded'
import MaterialSymbolsLogoutRounded from '~icons/material-symbols/logout-rounded'
import TablerExternalLink from '~icons/tabler/external-link'
import type { Menu, MenuItem } from './types'

defineProps<{
  menu: Menu
}>()

const iconMap: Record<string, FunctionalComponent> = {
  link: TablerExternalLink,
  add: MaterialSymbolsAddCircleOutline,
  delete: MaterialSymbolsDeleteOutlineRounded,
  signOut: MaterialSymbolsLogoutRounded,
}

function handleAction(item: MenuItem) {
  if (item.disabled) return
  if (!item.action) return

  item.action()
}
</script>
