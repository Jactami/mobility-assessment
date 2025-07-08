<template>
  <span
    class="divide-x divide-outline rounded-full p-1 text-sm text-on-surface-inverse shadow-sm"
    :style="{ backgroundColor: bgColor }"
  >
    <span class="px-2">{{ t(`category.${category}`) }}</span>
    <span class="px-2">{{ count }}</span>
  </span>
</template>

<script setup lang="ts">
import { useColorUtil } from '@/composables/util/color'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  category: string
  count: number
}>()

const { t } = useI18n()
const { categoryToColor } = useColorUtil()

const ALPHA = 'CC' // 80% opacity

const bgColor = computed(() => categoryToColor(props.category) + ALPHA)
</script>
