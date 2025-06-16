<template>
  <Layers.OlVectorLayer>
    <Sources.OlSourceVector>
      <Interactions.OlInteractionSelect :filter="selectInteractionFilter" @select="handleSelect">
        <Styles.OlStyle>
          <!-- Leave empty to prevent default selection style -->
        </Styles.OlStyle>
      </Interactions.OlInteractionSelect>
    </Sources.OlSourceVector>
  </Layers.OlVectorLayer>
  <Map.OlOverlay
    v-if="selectedPoi"
    :position="fromLonLat([selectedPoi.longitude, selectedPoi.latitude])"
    :auto-pan="{
      animation: {
        duration: 200,
      },
    }"
    positioning="bottom-center"
    :offset="[0, -30]"
  >
    <div class="bg-white p-1">
      <div>
        {{ selectedPoi.label }}
      </div>
      <button @click="selectedPoi = null">x</button>
    </div>
  </Map.OlOverlay>
</template>

<script setup lang="ts">
import type { Poi } from '@/db/types'
import type { Feature } from 'ol'
import type { SelectEvent } from 'ol/interaction/Select'
import { fromLonLat } from 'ol/proj'
import { ref } from 'vue'
import { Interactions, Layers, Map, Sources, Styles } from 'vue3-openlayers'

const selectedPoi = ref<Poi | null>(null)

function handleSelect(event: SelectEvent) {
  selectedPoi.value = event.selected[0].getProperties().poi
}

function selectInteractionFilter(feature: Feature) {
  return feature.get('poi') !== undefined
}
</script>
