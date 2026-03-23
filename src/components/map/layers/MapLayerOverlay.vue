<template>
  <!-- Selection Layer -->
  <OlVectorLayer>
    <OlSourceVector>
      <OlInteractionSelect
        :features="featureCollection"
        :filter="selectInteractionFilter"
        :toggle-condition="() => true"
        :style="null"
        @select="handleSelect"
      >
        <!-- With style=null, no styling is applied to the selected feature -->
      </OlInteractionSelect>
    </OlSourceVector>
  </OlVectorLayer>

  <!-- Map Overlay -->
  <OlOverlay
    v-if="projectStore.selectedPoi && !minimized"
    :position="fromLonLat([projectStore.selectedPoi.longitude, projectStore.selectedPoi.latitude])"
    :auto-pan="{
      animation: {
        duration: 200,
      },
    }"
    positioning="bottom-center"
    :offset="[0, -17]"
  >
    <div
      class="relative w-full max-w-96 min-w-64 rounded-border border-2 bg-surface-container-lowest p-2 shadow-md"
      :style="`border-color: ${color};`"
    >
      <div>
        <div class="flex items-start justify-between gap-x-10">
          <strong>
            {{
              projectStore.selectedPoi.label || t(`category.${projectStore.selectedPoi.category}`)
            }}
          </strong>
          <div class="flex gap-x-0.5">
            <UIButtonIcon
              icon="minimize"
              size="sm"
              :aria-label="t('common.minimize')"
              @click="handleMinimize"
            />
            <UIButtonIcon
              icon="close"
              size="sm"
              :aria-label="t('common.close')"
              @click="resetSelection"
            />
          </div>
        </div>
        <div class="mt-4 text-sm text-on-surface-variant">
          <div class="flex items-center gap-x-1">
            <ProjectCategoryIcon :category="projectStore.selectedPoi.category" class="size-5" />
            <span>{{ t(`category.${projectStore.selectedPoi.category}`) }}</span>
          </div>
          <div class="mt-2 flex items-center justify-between">
            <span>{{ n(projectStore.selectedPoi.distance, 'meter') }}</span>
            <div class="flex gap-x-0.5">
              <UIButtonIcon
                icon="edit"
                size="sm"
                :aria-label="t('action.edit')"
                @click="modalOpen = true"
              />
              <UIButtonIcon
                icon="delete"
                size="sm"
                :aria-label="t('action.delete')"
                @click="deletePoi(projectStore.selectedPoi)"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- Bottom Triangle -->
      <div
        class="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 border-t-8 border-r-8 border-l-8 border-r-transparent border-l-transparent"
        :style="`border-top-color: ${color};`"
      />
    </div>
  </OlOverlay>

  <ProjectPoiForm
    v-if="projectStore.selectedPoi"
    v-model:open="modalOpen"
    v-model:poi="projectStore.selectedPoi"
  />
</template>

<script setup lang="ts">
import ProjectCategoryIcon from '@/components/project/category/ProjectCategoryIcon.vue'
import ProjectPoiForm from '@/components/project/poi/ProjectPoiForm.vue'
import UIButtonIcon from '@/components/ui/button/UIButtonIcon.vue'
import { useNotification } from '@/composables/notification'
import { useColorUtil } from '@/composables/util/color'
import type { Poi } from '@/db/types'
import { useProjectStore } from '@/stores/Project'
import { Collection, type Feature } from 'ol'
import type { Geometry } from 'ol/geom'
import type { SelectEvent } from 'ol/interaction/Select'
import { fromLonLat } from 'ol/proj'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { OlInteractionSelect } from 'vue3-openlayers/interactions'
import { OlVectorLayer } from 'vue3-openlayers/layers'
import { OlOverlay } from 'vue3-openlayers/map'
import { OlSourceVector } from 'vue3-openlayers/sources'

const { n, t } = useI18n()
const { categoryToColor } = useColorUtil()
const { confirmDialog } = useNotification()
const projectStore = useProjectStore()

const modalOpen = ref(false)
const minimized = ref(false)

const featureCollection = new Collection<Feature<Geometry>>()

const color = computed(() =>
  projectStore.selectedPoi ? categoryToColor(projectStore.selectedPoi.category) : '#000',
)

function handleSelect(event: SelectEvent) {
  // Reset previous selected POI
  resetSelection()

  const selectedFeature = event.selected[0]

  // If user clicked outside of any feature, do nothing
  if (!selectedFeature) return

  // Select clicked POI
  featureCollection.push(selectedFeature)
  projectStore.setSelectedPoi(selectedFeature.getProperties().poi)
}

function handleMinimize() {
  featureCollection.clear()
  minimized.value = true
}

function resetSelection() {
  featureCollection.clear()
  projectStore.setSelectedPoi(null)
  minimized.value = false
}

function selectInteractionFilter(feature: Feature) {
  // Only select features that have a poi property
  return !!feature.getProperties().poi
}

// TODO: This is a duplicate of the delete function in ProjectPoiTable.vue
async function deletePoi(poi: Poi) {
  if (!projectStore.pois) return

  // Confirm deletion
  const confirmation = await confirmDialog({
    message: t('dialog.delete', { item: poi.label || t(`category.${poi.category}`) }),
    confirm: t('action.delete'),
  })
  if (!confirmation) return

  // Remove the POI from the store
  const newPois = projectStore.pois.filter((p) => p !== poi)
  projectStore.updateProjectState({ pois: newPois })
}

watch(
  () => projectStore.selectedPoi,
  () => {
    minimized.value = false
  },
)
</script>
