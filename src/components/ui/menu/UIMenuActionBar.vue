<template>
  <div class="flex flex-col items-center gap-5 rounded-full p-1.5">
    <UIButtonIcon
      v-for="item in items"
      :key="item.label"
      :icon="item.icon"
      :title="item.label"
      :tooltip="{
        content: item.label,
        position: 'left',
      }"
      class="bg-primary p-2.5 text-lg text-on-primary hover:bg-primary hover:brightness-125"
      @click="item.action"
    />
  </div>
</template>

<script setup lang="ts">
import UIButtonIcon from '../button/UIButtonIcon.vue'
import type { MenuListItem } from './types'

defineProps<{
  items: MenuListItem[]
}>()
</script>
