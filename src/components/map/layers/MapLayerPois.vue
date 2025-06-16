<template>
  <Layers.OlVectorLayer>
    <Sources.OlSourceVector>
      <template v-for="poi in projectStore.pois" :key="poi.id">
        <!-- Marker -->
        <Map.OlFeature :properties="{ poi }">
          <Geometries.OlGeomPoint :coordinates="fromLonLat([poi.longitude, poi.latitude])" />
          <Styles.OlStyle>
            <Styles.OlStyleIcon
              src="/img/map/marker.svg"
              :anchor="[0.5, 0.9]"
              :color="getColorByDomain(poi)"
            />
          </Styles.OlStyle>
        </Map.OlFeature>

        <!-- Icon; TODO: Add white background -->
        <Map.OlFeature>
          <Geometries.OlGeomPoint :coordinates="fromLonLat([poi.longitude, poi.latitude])" />
          <Styles.OlStyle>
            <Styles.OlStyleIcon
              :src="`/img/map/${poi.category}.svg`"
              :scale="0.5"
              color="#000"
              :anchor="[0.5, 1.4]"
            />
          </Styles.OlStyle>
        </Map.OlFeature>
      </template>
    </Sources.OlSourceVector>
  </Layers.OlVectorLayer>

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
import { DOMAINS } from '@/constants'
import type { Poi } from '@/db/types'
import { useProjectStore } from '@/stores/Project'
import type { Feature } from 'ol'
import type { SelectEvent } from 'ol/interaction/Select'
import { fromLonLat } from 'ol/proj'
import { ref } from 'vue'
import { Geometries, Interactions, Layers, Map, Sources, Styles } from 'vue3-openlayers'

const projectStore = useProjectStore()

const selectedPoi = ref<Poi | null>(null)

function handleSelect(event: SelectEvent) {
  selectedPoi.value = event.selected[0].getProperties().poi
}

function selectInteractionFilter(feature: Feature) {
  return feature.get('poi') !== undefined
}

function getColorByDomain(poi: Poi) {
  return DOMAINS.find((domain) =>
    domain.categories.some((category) => category.name === poi.category),
  )?.color
}
</script>
