<template>
  <UIPanel ref="mapPanelRef" :title="t('project.map')" icon="map">
    <UISkeletonLoader :loading="loading" :height="`${mapHeight}px`">
      <MapPanel
        v-model="selectedPoi"
        :project="project"
        :pois="pois"
        :disabled="loading"
        :height="mapHeight"
      />
    </UISkeletonLoader>
  </UIPanel>
</template>

<script setup lang="ts">
import MapPanel from '@/components/map/MapPanel.vue'
import UISkeletonLoader from '@/components/ui/skeleton/UISkeletonLoader.vue'
import UIPanel from '@/components/ui/UIPanel.vue'
import type { Poi, Project } from '@/db/types'
import { useI18n } from 'vue-i18n'

defineProps<{
  project: Project | null
  pois: Poi[] | null
  loading: boolean
}>()

const selectedPoi = defineModel<Poi | null>('selectedPoi')

const { t } = useI18n()

const mapHeight = 600 // px
</script>
