<template>
  <div class="relative mx-auto h-auto w-full max-w-sm">
    <!-- Progress Bar -->
    <svg viewBox="0 0 100 50">
      <path class="fill-none stroke-surface-container stroke-[5]" :d="arcPath" />
      <path
        :d="arcPath"
        class="fill-none stroke-[5]"
        :style="{
          strokeDasharray: circumference,
          strokeDashoffset: dashOffset,
          stroke: scoreToColor(props.scores?.total || 0),
        }"
      />
    </svg>

    <!-- Raw score value -->
    <div v-if="props.scores" class="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
      <div class="text-7xl font-bold" :style="{ color: scoreToColor(props.scores?.total || 0) }">
        {{ n(props.scores?.total * 100, 'rounded') }}
      </div>
      <div class="mt-2 -mb-1 text-xl text-on-surface-variant">{{ t('project.score') }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EvaluationScores } from '@/composables/evaluation/types'
import { useColorUtil } from '@/composables/util/color'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { n, t } = useI18n()
const { scoreToColor } = useColorUtil()

const props = defineProps<{
  scores?: EvaluationScores | null
}>()

const radius = 40
const arcPath = `M10,50 A${radius},${radius} 0 0,1 90,50`

const circumference = Math.PI * radius
const dashOffset = computed(() => `${circumference * (1 - (props.scores?.total || 0))}`)
</script>
