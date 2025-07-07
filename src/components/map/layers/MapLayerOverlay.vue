<template>
  <!-- Selection Layer -->
  <Layers.OlVectorLayer>
    <Sources.OlSourceVector>
      <Interactions.OlInteractionSelect
        :features="featureCollection as Collection<Feature>"
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
    v-if="overlayPoi"
    :position="fromLonLat([overlayPoi.longitude, overlayPoi.latitude])"
    :auto-pan="{
      animation: {
        duration: 200,
      },
    }"
    positioning="bottom-center"
    :offset="[0, -18]"
  >
    <div
      class="relative max-w-96 min-w-64 rounded-border border-2 border-outline bg-surface p-2 shadow-md"
      :style="`border-color: ${color};`"
    >
      <div class="flex items-start justify-between gap-x-10">
        <strong>{{ overlayPoi.label || t(`category.${overlayPoi.category}`) }}</strong>
        <IconButton icon="close" @click="clearSelection()" />
      </div>
      <div class="mt-3 flex justify-between gap-x-10 text-sm text-on-surface-variant">
        <div class="flex items-center gap-x-1">
          <img
            :src="`/img/map/${overlayPoi.category}.svg`"
            :alt="t(`category.${overlayPoi.category}`)"
            class="inline-block h-5 w-5"
          />
          <span>{{ t(`category.${overlayPoi.category}`) }}</span>
        </div>
        <span>{{ n(overlayPoi.distance, 'meter') }}</span>
      </div>
      <!-- Bottom Triangle -->
      <div
        class="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 border-t-8 border-r-8 border-l-8 border-r-transparent border-l-transparent"
        :style="`border-top-color: ${color};`"
      />
    </div>
  </Map.OlOverlay>
</template>

<script setup lang="ts">
import IconButton from '@/components/icon/IconButton.vue'
import { DOMAINS } from '@/constants'
import type { Poi } from '@/db/types'
import { Collection, type Feature } from 'ol'
import type { SelectEvent } from 'ol/interaction/Select'
import { fromLonLat } from 'ol/proj'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Interactions, Layers, Map, Sources } from 'vue3-openlayers'

const { n, t } = useI18n()

const selectedPoi = defineModel<Poi | null>()

const featureCollection = ref(new Collection<Feature>())

const overlayPoi = computed<Poi | undefined>(
  () => selectedPoi.value || featureCollection.value.getArray()[0]?.getProperties()?.poi,
)

const color = computed(() => (overlayPoi.value ? getColorByDomain(overlayPoi.value) : '#000'))

function handleSelect(event: SelectEvent) {
  featureCollection.value.clear()
  clearSelection()

  // Reset collection if click outside of any feature
  if (event.selected.length === 0) return

  // Add the selected feature to the collection
  featureCollection.value.push(event.selected[0])
}

function selectInteractionFilter(feature: Feature) {
  // Only select features that have a poi property
  return !!feature.getProperties().poi
}

// Reset the selection and clear the feature collection
function clearSelection() {
  featureCollection.value.clear()
  selectedPoi.value = null
}

// TODO: This is a duplicate of the one in MapLayerPois.vue -> refactor to a shared utility
function getColorByDomain(poi: Poi) {
  return DOMAINS.find((domain) =>
    domain.categories.some((category) => category.name === poi.category),
  )?.color
}
</script>
