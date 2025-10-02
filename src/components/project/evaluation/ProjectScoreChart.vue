<template>
  <div ref="chartContainer">
    <Radar ref="chartRef" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import type { EvaluationScores } from '@/composables/evaluation/types'
import { factorConfig } from '@/config/app'
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
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'
import { Radar, type ChartComponentRef } from 'vue-chartjs'
import { useI18n } from 'vue-i18n'

// register Chart.js components once
ChartJS.register(Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler)

// props
const props = defineProps<{
  scores?: EvaluationScores | null
}>()

defineExpose({ exportChart })

const { t } = useI18n()
const isDark = useDark()

const chartContainer = useTemplateRef('chartContainer')
const chartRef = useTemplateRef<ChartComponentRef<'radar'>>('chartRef')

const data = ref<number[]>([])

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
  labels: factorConfig.map((factor) => t(`factor.${factor.name}`)),
  datasets: [
    {
      data: data.value,
      fill: true,
      backgroundColor: chartColors.value.background,
      borderColor: chartColors.value.border,
      borderWidth: 1,
      pointBackgroundColor: factorConfig.map((factor) => factor.color),
      pointBorderColor: chartColors.value.border,
      pointRadius: 5,
    },
  ],
}))

const chartOptions = computed<ChartOptions<'radar'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
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
        color: (ctx) => factorConfig[ctx.index]?.color,
      },
      ticks: {
        color: chartColors.value.text,
        backdropColor: 'transparent',
      },
    },
  },
  animation: {
    duration: 1000,
    easing: 'easeInOutQuad',
  },
  plugins: {
    title: {
      display: false,
      text: t('project.score'),
      color: chartColors.value.text,
    },
    legend: {
      display: false,
    },
    // tooltip: {
    //   callbacks: {
    //     label: (context) => `${context.formattedValue}%`,
    //   },
    // },
  },
}))

function exportChart() {
  const chart = chartRef.value?.chart

  if (!chart) return

  return new Promise<string>((resolve) => {
    // Save original chart config
    const originalDim = [chart.width, chart.height]
    const isResponsive = chart.options.responsive
    const originalAnimation = chart.options.animation

    const originalDark = isDark.value

    // Disable animations and responsiveness
    chart.options.animation = false
    chart.options.responsive = false

    // Resize
    chart.resize(500, 500)

    // Force light mode for consistent export
    isDark.value = false

    // Force update to ensure render
    chart.update()

    // Small trick: wait for next frame
    requestAnimationFrame(() => {
      const img = chart.toBase64Image()

      // Restore
      chart.options.animation = originalAnimation
      chart.options.responsive = isResponsive
      chart.resize(originalDim[0], originalDim[1])
      chart.update()

      // Restore dark mode
      isDark.value = originalDark

      resolve(img)
    })
  })
}

// Delay the data update to force animation on initial render
watch(
  () => props.scores,
  async (newScores) => {
    if (newScores) {
      await nextTick()
      data.value = factorConfig.map((factor) => (newScores.partial?.[factor.name] ?? 0) * 100)
    } else {
      data.value = []
    }
  },
  { immediate: true },
)
</script>
