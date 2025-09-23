<template>
  <div class="fixed bottom-0 left-1/2 z-10 w-full -translate-x-1/2 sm:bottom-5 sm:w-auto">
    <div
      class="border-outline bg-surface-container-lowest flex items-center gap-2 border-t p-2 sm:rounded-full sm:border sm:shadow-lg"
    >
      <template v-for="item in items" :key="item.label">
        <div class="flex-1">
          <UITooltip :message="item.label" position="top">
            <UIButtonIcon
              :icon="item.icon"
              :title="item.label"
              :disabled="item.disabled"
              class="hover:bg-primary-container hover:text-on-primary-container flex aspect-auto w-full justify-center rounded-full p-3.5 text-xl sm:p-2.5"
              @click="item.action"
            />
          </UITooltip>
        </div>
        <div v-if="item.divider" class="bg-outline my-1 w-px self-stretch" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import UIButtonIcon from '../button/UIButtonIcon.vue'
import UITooltip from '../UITooltip.vue'
import type { MenuListItem } from './types'

defineProps<{
  items: MenuListItem[]
}>()
</script>
