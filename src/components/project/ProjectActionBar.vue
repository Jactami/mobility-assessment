<template>
  <div class="flex flex-col items-center gap-4 rounded-full p-1.5">
    <BaseButton
      v-for="btn in buttons"
      :key="btn.title"
      :title="btn.title"
      class="aspect-square rounded-full p-2.5 text-lg"
      @click="btn.action"
    >
      <IconRenderer :icon="btn.icon" class="text-xl" />
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import IconRenderer from '@/components/icon/IconRenderer.vue'
import type { Icon } from '@/components/icon/types'

// TODO: Make type globally available
interface Props {
  title: string
  icon: Icon
  action: () => void
}

defineProps<{
  buttons: Props[]
}>()
</script>
