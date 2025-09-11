<template>
  <dl class="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 md:grid-cols-3">
    <div v-for="domain in DOMAINS" :key="domain.name" class="space-y-2">
      <div class="flex justify-between gap-1 font-semibold">
        <dt>
          <span>{{ t(`domain.${domain.name}`) }}</span>
        </dt>
        <dd
          v-if="scores?.domain[domain.name]"
          class="transition-color duration-500"
          :style="{ color: scoreToColor(scores.domain[domain.name]) }"
        >
          {{ n(scores?.domain[domain.name] * 100, 'rounded') }}
        </dd>
      </div>
      <div class="flex h-2 overflow-hidden rounded-border bg-surface-container">
        <div
          v-if="scores?.domain[domain.name]"
          class="h-full rounded-border transition-all duration-500"
          :style="{
            backgroundColor: scoreToColor(scores.domain[domain.name]),
            width: `${scores.domain[domain.name] * 100}%`,
          }"
        />
      </div>
    </div>
  </dl>
</template>

<script setup lang="ts">
import type { EvaluationScores } from '@/composables/evaluation/types'
import { useColorUtil } from '@/composables/util/color'
import { DOMAINS } from '@/constants'
import { useI18n } from 'vue-i18n'

const { n, t } = useI18n()
const { scoreToColor } = useColorUtil()

defineProps<{
  scores?: EvaluationScores | null
}>()
</script>
