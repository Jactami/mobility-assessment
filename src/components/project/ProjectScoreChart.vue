<template>
  <div ref="chartContainer">
    <Radar ref="chartRef" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import type { EvaluationScores } from '@/composables/evaluation/types'
import { DOMAINS } from '@/constants'
import { useDark, useResizeObserver } from '@vueuse/core'
import {
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import { computed, ref } from 'vue'
import { Radar, type ChartComponentRef } from 'vue-chartjs'
import { useI18n } from 'vue-i18n'

// register Chart.js components once
ChartJS.register(Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler)

// props
const props = defineProps<{
  scores: EvaluationScores
}>()

const emits = defineEmits<{
  (e: 'export', image: string): void
}>()

const { t } = useI18n()
const isDark = useDark()

const chartContainer = ref<HTMLDivElement | null>(null)
const chartRef = ref<ChartComponentRef | null>(null)

const chartColors = computed(() => ({
  text: isDark.value ? '#f9fafb' : '#111827',
  grid: isDark.value ? '#374151' : '#d1d5db',
  border: isDark.value ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
  background: isDark.value ? 'rgba(54, 162, 235, 0.3)' : 'rgba(54, 162, 235, 0.2)',
}))

// Update chart size in browser window resize
useResizeObserver(chartContainer, () => {
  chartRef.value?.chart?.resize()
})

const chartData = computed<ChartData<'radar'>>(() => ({
  labels: DOMAINS.map((domain) => t(`domain.${domain.name}`)),
  datasets: [
    {
      data: DOMAINS.map((domain) => props.scores.domain[domain.name] * 100),
      fill: true,
      backgroundColor: chartColors.value.background,
      borderColor: chartColors.value.border,
      borderWidth: 1,
      pointBackgroundColor: DOMAINS.map((domain) => domain.color),
      pointBorderColor: chartColors.value.border,
      pointRadius: 5,
    },
  ],
}))

const chartOptions = computed<ChartOptions<'radar'>>(() => ({
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    r: {
      beginAtZero: true,
      grid: {
        color: chartColors.value.grid,
      },
      angleLines: {
        color: chartColors.value.grid,
      },
      pointLabels: {
        font: {
          size: 14,
          weight: 'bold',
        },
        color: (ctx) => DOMAINS[ctx.index].color,
      },
      ticks: {
        color: chartColors.value.text,
        backdropColor: 'transparent',
      },
    },
  },
  plugins: {
    title: {
      display: true,
      text: t('project.score'),
      font: {
        size: 20,
      },
      color: chartColors.value.text,
    },
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.formattedValue}%`,
      },
    },
  },
  animation: {
    onComplete: async () => {
      const img = exportChart()
      console.log(img)
      if (img) emits('export', img)
    },
  },
}))

function exportChart() {
  const chart = chartRef.value?.chart

  if (!chart) return

  // Save original chart config
  const originalDim = [chart.width, chart.height]
  const isResponsive = chart.options.responsive
  chart.options.animation = false // Disable animation for export

  // Set chart to fixed size for export
  chart.options.responsive = false
  chart.resize(500, 500) // Set fixed size for export

  // Export chart as base64 string
  const img = chart.toBase64Image()

  // Restore original chart config
  chart.options.responsive = isResponsive
  chart.resize(originalDim[0], originalDim[1])

  return img
}
</script>
