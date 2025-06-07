<template>
  <Layers.OlVectorLayer>
    <Sources.OlSourceVector>
      <Map.OlFeature v-for="poi in projectStore.pois" :key="poi.id">
        <!-- TODO: Replace circles with nice looking poi markers -->
        <Geometries.OlGeomPoint :coordinates="fromLonLat([poi.longitude, poi.latitude])" />
        <Styles.OlStyle>
          <Styles.OlStyleCircle :radius="4">
            <Styles.OlStyleStroke :width="0" />
            <Styles.OlStyleFill :color="getColorByCategory(poi)" />
          </Styles.OlStyleCircle>
        </Styles.OlStyle>
      </Map.OlFeature>
    </Sources.OlSourceVector>
  </Layers.OlVectorLayer>
</template>

<script setup lang="ts">
import { DOMAINS } from '@/constants'
import type { Poi } from '@/db/types'
import { useProjectStore } from '@/stores/Project'
import { fromLonLat } from 'ol/proj'
import { Geometries, Layers, Map, Sources, Styles } from 'vue3-openlayers'

const projectStore = useProjectStore()

function getColorByCategory(poi: Poi) {
  return DOMAINS.flatMap((domain) => domain.categories).find(
    (category) => category.name === poi.category,
  )?.color
}
</script>
