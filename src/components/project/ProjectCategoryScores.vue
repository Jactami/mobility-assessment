<template>
  <div>
    <div class="flex justify-between gap-2 text-sm font-semibold text-on-surface-variant">
      <dt class="flex items-center gap-1.5">
        <div class="size-2 rounded-full" :style="{ backgroundColor: domain.color }" />
        <span>{{ t(`domain.${domain.name}`) }}</span>
      </dt>
      <dd
        v-if="typeof score === 'number'"
        class="transition-color duration-1000"
        :style="{ color: scoreToColor(score) }"
      >
        {{ n(score * 100, 'rounded') }}
      </dd>
    </div>
    <div class="mt-1.5 flex h-2 overflow-hidden rounded-border bg-surface-container">
      <div
        v-if="typeof score === 'number'"
        class="h-full rounded-border transition-all duration-1000"
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
import type { AreaDomain } from '@/types'
import { nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { n, t } = useI18n()
const { scoreToColor } = useColorUtil()

const props = defineProps<{
  domain: AreaDomain
  score?: number | null
}>()

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
