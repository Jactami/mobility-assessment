<template>
  <div
    class="overflow-hidden rounded-border border border-outline bg-surface p-2.5 shadow-sm sm:p-4"
  >
    <div v-if="title || icon">
      <div class="flex items-center gap-x-1 text-base font-bold text-on-surface-variant">
        <UIIcon v-if="icon" :icon="icon" class="text-lg" />
        <h2 v-if="title">{{ title }}</h2>
      </div>
      <hr class="mt-2 mb-4 border border-outline-variant" />
    </div>
    <div>
      <slot>
        <!-- Panel content goes here... -->
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Icon } from './icon/types'
import UIIcon from './icon/UIIcon.vue'

defineProps<{
  title?: string
  icon?: Icon
}>()
</script>
