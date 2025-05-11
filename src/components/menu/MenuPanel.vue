<template>
  <div
    class="w-full max-w-56 rounded-md border border-outline-variant bg-surface p-1 text-on-surface"
  >
    <ul class="list-none">
      <li v-for="item in menu" :key="item.label">
        <div
          class="rounded-md"
          :class="{
            'cursor-pointer hover:bg-surface-container':
              (item.action || item.link) && !item.disabled,
            'cursor-not-allowed opacity-50': item.disabled,
          }"
          @click="handleAction(item)"
        >
          <component
            :is="item.link && !item.disabled ? 'RouterLink' : 'div'"
            class="flex items-center gap-x-1 px-2 py-1"
            :to="item.link"
          >
            <component v-if="iconMap[item.icon]" :is="iconMap[item.icon]" />
            <span>
              {{ item.label }}
            </span>
          </component>
        </div>
        <hr v-if="item.divider" class="my-1 border-outline-variant" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { FunctionalComponent } from 'vue'
import type { Menu, MenuItem } from './types'
import MaterialSymbolsDeleteOutlineRounded from '~icons/material-symbols/delete-outline-rounded'
import MaterialSymbolsAddCircleOutline from '~icons/material-symbols/add-circle-outline'
import TablerExternalLink from '~icons/tabler/external-link'

defineProps<{
  menu: Menu
}>()

const iconMap: Record<string, FunctionalComponent> = {
  link: TablerExternalLink,
  add: MaterialSymbolsAddCircleOutline,
  delete: MaterialSymbolsDeleteOutlineRounded,
}

function handleAction(item: MenuItem) {
  if (item.disabled) return
  if (!item.action) return

  item.action()
}
</script>
