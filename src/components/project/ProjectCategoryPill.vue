<template>
  <div
    class="text-on-surface-inverse flex items-center gap-x-2 rounded-full px-3 py-1 text-xs shadow-sm sm:text-sm"
    :style="{ backgroundColor: bgColor }"
  >
    <ProjectCategoryIcon :category="category" :color="color" class="size-3.5" />
    <span>{{ t(`category.${category}`) }}</span>
    <div class="border-on-surface-inverse my-0.5 self-stretch border"></div>
    <span>{{ count }}</span>
  </div>
</template>

<script setup lang="ts">
import { useColorUtil } from '@/composables/util/color'
import { useDark } from '@vueuse/core'
import { computed, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ProjectCategoryIcon from './ProjectCategoryIcon.vue'

const props = defineProps<{
  category: string
  count: number
}>()

const { t } = useI18n()
const { categoryToColor } = useColorUtil()
const isDark = useDark()

const color = ref()

const ALPHA = 'CC' // 80% opacity

const bgColor = computed(() => categoryToColor(props.category) + ALPHA)

// observe dark mode changes to update icon color
// not happy with this, but works for now
watch(
  isDark,
  async () => {
    await nextTick()
    color.value = getComputedStyle(document.body).getPropertyValue('--color-on-surface-inverse')
  },
  { immediate: true },
)
</script>
