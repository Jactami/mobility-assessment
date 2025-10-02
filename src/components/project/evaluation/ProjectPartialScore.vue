<template>
  <div>
    <div class="text-on-surface-variant flex justify-between gap-2 text-sm font-semibold">
      <div class="flex items-center gap-1.5">
        <div class="size-2 rounded-full" :style="{ backgroundColor: factor.color }" />
        <span>{{ t(`factor.${factor.name}`) }}</span>
      </div>
      <div
        v-if="typeof score === 'number'"
        class="transition-color duration-1000"
        :style="{ color: scoreToColor(score) }"
      >
        {{ n(score * 100, 'rounded') }}
      </div>
    </div>
    <div class="rounded-border bg-surface-container-high mt-1.5 flex h-2 overflow-hidden">
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
import type { LocationFactor } from '@/config/app/types'
import { nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  factor: LocationFactor
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
