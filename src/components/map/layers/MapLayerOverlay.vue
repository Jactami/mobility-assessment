<template>
  <!-- Selection Layer -->
  <Layers.OlVectorLayer>
    <Sources.OlSourceVector>
      <Interactions.OlInteractionSelect
        :filter="selectInteractionFilter"
        :style="null"
        @select="handleSelect"
      >
        <!-- With style=null, no styling is applied to the selected feature -->
      </Interactions.OlInteractionSelect>
    </Sources.OlSourceVector>
  </Layers.OlVectorLayer>

  <!-- Map Overlay -->
  <Map.OlOverlay
    v-if="selectedPoi"
    :position="fromLonLat([selectedPoi.longitude, selectedPoi.latitude])"
    :auto-pan="{
      animation: {
        duration: 200,
      },
    }"
    positioning="bottom-center"
    :offset="[0, -18]"
  >
    <div
      class="relative max-w-96 min-w-64 rounded-border border-2 bg-surface p-2 shadow-md"
      :style="`border-color: ${color};`"
    >
      <div>
        <div class="flex items-start justify-between gap-x-10">
          <strong>{{ selectedPoi.label || t(`category.${selectedPoi.category}`) }}</strong>
          <IconButton icon="close" @click="selectedPoi = null" />
        </div>
        <div class="mt-4 text-sm text-on-surface-variant">
          <div class="flex items-center gap-x-1">
            <img
              :src="`/img/map/${selectedPoi.category}.svg`"
              :alt="t(`category.${selectedPoi.category}`)"
              class="inline-block h-5 w-5"
            />
            <span>{{ t(`category.${selectedPoi.category}`) }}</span>
          </div>
          <div class="mt-2 flex items-center justify-between">
            <span>{{ n(selectedPoi.distance, 'meter') }}</span>
            <div class="">
              <IconButton icon="edit" @click="modalOpen = true" />
              <IconButton icon="delete" @click="deletePoi(selectedPoi)" />
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
  </Map.OlOverlay>

  <ProjectPoiForm v-if="selectedPoi" v-model:open="modalOpen" v-model:poi="selectedPoi" />
</template>

<script setup lang="ts">
import IconButton from '@/components/icon/IconButton.vue'
import ProjectPoiForm from '@/components/project/ProjectPoiForm.vue'
import { useNotification } from '@/composables/notification'
import { useColorUtil } from '@/composables/util/color'
import type { Poi } from '@/db/types'
import { useProjectStore } from '@/stores/Project'
import { type Feature } from 'ol'
import type { SelectEvent } from 'ol/interaction/Select'
import { fromLonLat } from 'ol/proj'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Interactions, Layers, Map, Sources } from 'vue3-openlayers'

const { n, t } = useI18n()
const { categoryToColor } = useColorUtil()
const { confirmDialog } = useNotification()
const projectStore = useProjectStore()

const modalOpen = ref(false)

const selectedPoi = defineModel<Poi | null>()

const color = computed(() =>
  selectedPoi.value ? categoryToColor(selectedPoi.value.category) : '#000',
)

function handleSelect(event: SelectEvent) {
  // Important: Set the poi as a property on the feature in the poi layer!
  selectedPoi.value = event.selected.length > 0 ? event.selected[0].getProperties().poi : null
}

function selectInteractionFilter(feature: Feature) {
  // Only select features that have a poi property
  return !!feature.getProperties().poi
}

// TODO: This is a duplicate of the delete function in ProjectPoiTable.vue
async function deletePoi(poi: Poi) {
  if (!projectStore.pois) return

  // Confirm deletion
  const confirmation = await confirmDialog(
    t('table.confirmDelete', { object: poi.label || t(`category.${poi.category}`) }),
  )
  if (!confirmation) return

  // Remove the POI from the store
  const newPois = projectStore.pois.filter((p) => p !== poi)
  projectStore.updatePois(newPois)
}
</script>
