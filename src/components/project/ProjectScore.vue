<template>
  <div class="text-center text-on-surface-inverse">
    <div class="rounded-border p-6" :style="{ backgroundColor: bgColor }">
      <div class="space-x-1.5 font-semibold">
        <span class="text-8xl">{{ n(score * 100, 'rounded') }}</span>
        <span class="text-2xl">/100</span>
      </div>
      <div class="mt-4 text-3xl">{{ t('project.score') }}</div>
    </div>

    <div class="mt-2 rounded-border p-1 text-sm" :style="{ backgroundColor: bgColor }">
      <span>
        {{ t('project.scoreDescription') }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useColorUtil } from '@/composables/util/color'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  score: number
}>()

const { n, t } = useI18n()
const { scoreToColor } = useColorUtil()

const bgColor = computed(() => scoreToColor(props.score))
</script>
