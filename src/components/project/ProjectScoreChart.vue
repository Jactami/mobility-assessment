<template>
  <Radar :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import type { EvaluationScores } from '@/composables/evaluation/types'
import { DOMAINS } from '@/constants'
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
import { computed } from 'vue'
import { Radar } from 'vue-chartjs'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// register Chart.js components once
ChartJS.register(Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler)

// props
const props = defineProps<{
  scores: EvaluationScores
}>()

const borderColor = 'rgba(51, 51, 51, 0.5)'

const chartData = computed<ChartData<'radar'>>(() => ({
  labels: DOMAINS.map((domain) => t(`domain.${domain.name}`)),
  datasets: [
    {
      data: DOMAINS.map((domain) => props.scores.domain[domain.name] * 100),
      fill: true,
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: borderColor,
      borderWidth: 1,

      pointBackgroundColor: DOMAINS.map((domain) => domain.color),
      pointBorderColor: borderColor,
      pointRadius: 5,
    },
  ],
}))

const chartOptions: ChartOptions<'radar'> = {
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    r: {
      beginAtZero: true,
      pointLabels: {
        font: {
          size: 14,
          weight: 'bold',
        },
        color: (ctx) => DOMAINS[ctx.index].color, // use domain colors for point labels
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
    },
    legend: {
      display: false,
    },
  },
}
</script>
