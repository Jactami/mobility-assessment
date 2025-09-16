<template>
  <div>
    <div class="flex justify-between gap-2 text-sm font-semibold text-on-surface-variant">
      <dt class="flex items-center gap-1.5">
        <div class="size-2 rounded-full" :style="{ backgroundColor: domain.color }" />
        <span>{{ t(`domain.${domain.name}`) }}</span>
      </dt>
      <dd
        v-if="typeof score === 'number'"
        class="transition-color duration-500"
        :style="{ color: scoreToColor(score) }"
      >
        {{ n(score * 100, 'rounded') }}
      </dd>
    </div>
    <div class="mt-1.5 flex h-2 overflow-hidden rounded-border bg-surface-container">
      <div
        v-if="score"
        class="h-full rounded-border transition-all duration-500"
        :style="{
          backgroundColor: scoreToColor(score),
          width: `${score * 100}%`,
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useColorUtil } from '@/composables/util/color'
import type { AreaDomain } from '@/types'
import { useI18n } from 'vue-i18n'

const { n, t } = useI18n()
const { scoreToColor } = useColorUtil()

defineProps<{
  domain: AreaDomain
  score?: number | null
}>()
</script>
