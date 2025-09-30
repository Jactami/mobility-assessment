<template>
  <div
    class="rounded-border border-outline bg-surface relative overflow-hidden border p-2.5 shadow-sm sm:p-4"
  >
    <!-- Panel Actions -->
    <div v-if="actions && actions.length > 0" class="absolute right-2.5 top-2.5">
      <UIMenu v-if="actions.length > 1" :items="actions" position="bottom-end" />
      <UITooltip v-else-if="actions[0]" :message="actions[0].label" position="top">
        <UIButtonIcon :icon="actions[0].icon" @click="actions[0].action" />
      </UITooltip>
    </div>

    <!-- Panel Header -->
    <div v-if="title || icon">
      <div class="text-on-surface-variant mb-1 flex items-center gap-x-1 text-base font-bold">
        <UIIcon v-if="icon" :icon="icon" class="text-lg" />
        <h2 v-if="title">{{ title }}</h2>
      </div>
      <hr class="border-outline-variant mb-4 mt-1 border" />
    </div>

    <!-- Panel Body -->
    <div>
      <slot>
        <!-- Panel content goes here... -->
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import UIButtonIcon from './button/UIButtonIcon.vue'
import type { Icon } from './icon/types'
import UIIcon from './icon/UIIcon.vue'
import type { MenuListItem } from './menu/types'
import UIMenu from './menu/UIMenu.vue'
import UITooltip from './UITooltip.vue'

defineProps<{
  title?: string
  icon?: Icon
  actions?: MenuListItem[]
}>()
</script>
