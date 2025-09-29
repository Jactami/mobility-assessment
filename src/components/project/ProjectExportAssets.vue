<template>
  <!-- Map Export -->
  <div class="invisible">
    <MapPanel
      v-for="dimension in geoConfig"
      :key="dimension.name"
      ref="mapRefs"
      :project="project"
      :pois="getPoisByDimension(pois || [], dimension.name)"
      :height="1"
      :static="true"
    />
  </div>

  <!-- Chart Export -->
  <div class="hidden h-1">
    <ProjectScoreChart ref="chartRef" :scores="scores" />
  </div>
</template>

<script setup lang="ts">
import MapPanel from '@/components/map/MapPanel.vue'
import type { EvaluationScores } from '@/composables/evaluation/types'
import { useProjectUtil } from '@/composables/util/project'
import { geoConfig } from '@/config/geo'
import type { Poi, Project } from '@/db/types'
import { useTemplateRef } from 'vue'
import ProjectScoreChart from './evaluation/ProjectScoreChart.vue'

defineProps<{
  project: Project
  pois: Poi[]
  scores: EvaluationScores
}>()

defineExpose({ exportAssets })

const { getPoisByDimension } = useProjectUtil()

const mapRefs = useTemplateRef('mapRefs')
const chartRef = useTemplateRef('chartRef')

/**
 * Export maps and chart as base64 strings
 */
async function exportAssets() {
  // Export maps
  const maps: Record<string, string> = {}
  await Promise.all(
    mapRefs.value?.map(async (mapRef, i) => {
      const img = await mapRef?.exportMap()
      if (img && geoConfig[i]?.name) maps[geoConfig[i].name] = img
    }) || [],
  )

  // Export chart
  const chart = (await chartRef.value?.exportChart()) || ''
  return { maps, chart }
}
</script>
