<template>
  <!-- https://excalidraw.com/ -->
  <div
    class="flex items-center gap-2 rounded-full border border-outline bg-surface p-1.5 shadow-md"
  >
    <template v-for="item in items" :key="item.label">
      <UIButtonIcon
        :icon="item.icon"
        :title="item.label"
        :disabled="item.disabled"
        :tooltip="{ content: item.label }"
        class="p-2.5 text-lg hover:bg-primary-container hover:text-on-primary-container"
        @click="item.action"
      />
      <div v-if="item.divider" class="my-2 w-px self-stretch bg-outline-variant" />
    </template>
  </div>
</template>

<script setup lang="ts">
import UIButtonIcon from '../button/UIButtonIcon.vue'
import type { MenuListItem } from './types'

defineProps<{
  items: MenuListItem[]
}>()
</script>
