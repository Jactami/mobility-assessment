<template>
  <!-- Selection Layer -->
  <Layers.OlVectorLayer>
    <Sources.OlSourceVector>
      <Interactions.OlInteractionSelect :filter="selectInteractionFilter" @select="handleSelect">
        <Styles.OlStyle>
          <!-- Leave empty to prevent default selection style -->
        </Styles.OlStyle>
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
    :offset="[0, -20]"
  >
    <div
      class="relative max-w-96 min-w-64 rounded-border border-2 border-outline bg-surface p-2 shadow-md"
      :style="`border-color: ${color};`"
    >
      <div class="flex items-start justify-between gap-x-10">
        <strong>{{ selectedPoi.label }}</strong>
        <IconButton icon="close" @click="selectedPoi = null" />
      </div>
      <div class="mt-3 flex justify-between gap-x-10 text-sm text-on-surface-variant">
        <div class="flex items-center gap-x-1">
          <img
            :src="`/img/map/${selectedPoi.category}.svg`"
            :alt="t(`category.${selectedPoi.category}`)"
            class="inline-block h-5 w-5"
          />
          <span>{{ t(`category.${selectedPoi.category}`) }}</span>
        </div>
        <span>{{ n(selectedPoi.distance, 'meter') }}</span>
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
import type { Feature } from 'ol'
import type { SelectEvent } from 'ol/interaction/Select'
import { fromLonLat } from 'ol/proj'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Interactions, Layers, Map, Sources, Styles } from 'vue3-openlayers'

const { n, t } = useI18n()

const selectedPoi = ref<Poi | null>(null)

const color = computed(() => (selectedPoi.value ? getColorByDomain(selectedPoi.value) : '#000'))

function handleSelect(event: SelectEvent) {
  // Reset selectedPoi if click outside of any feature
  if (event.selected.length === 0) {
    selectedPoi.value = null
    return
  }

  // Otherwise, set the selected POI from the first selected feature
  selectedPoi.value = event.selected[0].getProperties()?.poi
}

function selectInteractionFilter(feature: Feature) {
  // Only select features that have a 'poi' property
  return feature.get('poi') !== undefined
}

// TODO: This is a duplicate of the one in MapLayerPois.vue -> refactor to a shared utility
function getColorByDomain(poi: Poi) {
  return DOMAINS.find((domain) =>
    domain.categories.some((category) => category.name === poi.category),
  )?.color
}
</script>
