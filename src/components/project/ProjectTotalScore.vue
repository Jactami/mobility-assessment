<template>
  <svg viewBox="0 5 100 50" class="h-auto w-full">
    <!-- Background Arc -->
    <path class="fill-none stroke-surface-container stroke-[5]" :d="arcPath" />

    <!-- Foreground Arc -->
    <path
      :d="arcPath"
      class="fill-none stroke-[5] transition-all duration-1000"
      :style="{
        strokeDasharray: circumference,
        strokeDashoffset: dashOffset,
        stroke: scoreToColor(score || 0),
      }"
    />

    <!-- Score Text -->
    <text
      v-if="typeof score === 'number'"
      x="50"
      y="38"
      text-anchor="middle"
      class="transition-color font-bold"
      :fill="scoreToColor(score)"
      font-size="16"
    >
      {{ n(score * 100, 'rounded') }}
    </text>

    <!-- Label Text -->
    <text
      x="50"
      y="48"
      text-anchor="middle"
      class="font-semibold text-on-surface-variant"
      fill="currentColor"
      font-size="6"
    >
      {{ t('project.score') }}
    </text>
  </svg>
</template>

<script setup lang="ts">
import { useColorUtil } from '@/composables/util/color'
import { nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  score?: number | null
}>()

const { n, t } = useI18n()
const { scoreToColor } = useColorUtil()

const radius = 40
const arcPath = `M10,50 A${radius},${radius} 0 0,1 90,50`

const circumference = Math.PI * radius
const dashOffset = ref(circumference.toString())

// Delay the dash offset update to force animation on initial render
watch(
  () => props.score,
  async (newScore) => {
    await nextTick()
    dashOffset.value = `${circumference * (1 - (newScore || 0))}`
  },
  { immediate: true },
)
</script>
