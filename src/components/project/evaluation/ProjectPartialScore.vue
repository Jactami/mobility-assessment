<template>
  <div>
    <div class="text-on-surface-variant flex justify-between gap-2 text-sm font-semibold">
      <dt class="flex items-center gap-1.5">
        <div class="size-2 rounded-full" :style="{ backgroundColor: dimension.color }" />
        <span>{{ t(`dimension.${dimension.name}`) }}</span>
      </dt>
      <dd
        v-if="typeof score === 'number'"
        class="transition-color duration-1000"
        :style="{ color: scoreToColor(score) }"
      >
        {{ n(score * 100, 'rounded') }}
      </dd>
    </div>
    <div class="rounded-border bg-surface-container mt-1.5 flex h-2 overflow-hidden">
      <div
        v-if="typeof score === 'number'"
        class="rounded-border h-full transition-all duration-1000"
        :style="{
          backgroundColor: scoreToColor(score),
          width: `${barWidth}%`,
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useColorUtil } from '@/composables/util/color'
import type { GeoDimension } from '@/config/geo/types'
import { nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  dimension: GeoDimension
  score?: number | null
}>()

const { n, t } = useI18n()
const { scoreToColor } = useColorUtil()

const barWidth = ref(0)

// Delay the bar width update to force animation on initial render
watch(
  () => props.score,
  async (newScore) => {
    if (typeof newScore === 'number') {
      await nextTick()
      barWidth.value = newScore * 100
    } else {
      barWidth.value = 0
    }
  },
  { immediate: true },
)
</script>
