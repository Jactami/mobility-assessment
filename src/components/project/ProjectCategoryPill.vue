<template>
  <div
    class="flex items-center gap-x-2 rounded-full px-3 py-1 text-sm text-on-surface-inverse shadow-sm"
    :style="{ backgroundColor: bgColor }"
  >
    <ProjectCategoryIcon :category="category" :color="color" class="size-3.5" />
    <span>{{ t(`category.${category}`) }}</span>
    <div class="my-0.5 self-stretch border border-on-surface-inverse"></div>
    <span>{{ count }}</span>
  </div>
</template>

<script setup lang="ts">
import { useColorUtil } from '@/composables/util/color'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ProjectCategoryIcon from './ProjectCategoryIcon.vue'

const props = defineProps<{
  category: string
  count: number
}>()

const { t } = useI18n()
const { categoryToColor } = useColorUtil()

const ALPHA = 'CC' // 80% opacity

const bgColor = computed(() => categoryToColor(props.category) + ALPHA)

const color = getComputedStyle(document.body).getPropertyValue('--color-on-surface-inverse')
</script>
