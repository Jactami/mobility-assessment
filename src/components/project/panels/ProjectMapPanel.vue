<template>
  <UIPanel ref="mapPanelRef" :title="t('project.map')" icon="map">
    <!-- Category Filter -->
    <div>
      <ProjectMapFilter :loading="loading" @update-filter="handleFilterUpdate" />
    </div>

    <!-- TODO: Maybe implement category filter as well? -->

    <!-- Map -->
    <div class="mt-3">
      <UISkeletonLoader :loading="loading" :height="`${mapHeight}px`">
        <MapPanel :project="project" :pois="filteredPois" :disabled="loading" :height="mapHeight" />
      </UISkeletonLoader>
    </div>
  </UIPanel>
</template>

<script setup lang="ts">
import MapPanel from '@/components/map/MapPanel.vue'
import UISkeletonLoader from '@/components/ui/skeleton/UISkeletonLoader.vue'
import UIPanel from '@/components/ui/UIPanel.vue'
import { useProjectUtil } from '@/composables/util/project'
import type { Poi, Project } from '@/db/types'
import { useProjectStore } from '@/stores/Project'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ProjectMapFilter from '../map/ProjectMapFilter.vue'

const props = defineProps<{
  project: Project | null
  pois: Poi[] | null
  loading: boolean
}>()

const { t } = useI18n()
const { getPoisByFactor, getFactorByCategory } = useProjectUtil()
const projectStore = useProjectStore()

const mapHeight = 600 // px

// TODO: Decide whether to move filter to store to make it available globally
const filter = ref<string | null>(null)

const filteredPois = computed(() => {
  if (!filter.value || !props.pois) return props.pois
  return getPoisByFactor(props.pois, filter.value)
})

function handleFilterUpdate(newFilter: string | null) {
  filter.value = newFilter

  // check if selected POI matches the filter
  if (
    filter.value &&
    projectStore.selectedPoi &&
    getFactorByCategory(projectStore.selectedPoi.category)?.name !== filter.value
  ) {
    projectStore.setSelectedPoi(null)
  }
}
</script>
