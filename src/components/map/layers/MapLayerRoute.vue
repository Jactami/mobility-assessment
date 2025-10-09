<template>
  <OlVectorLayer>
    <OlSourceVector v-if="projectStore.selectedPoi && coordinates">
      <OlFeature>
        <OlGeomLineString :coordinates="coordinates" />
        <OlStyle>
          <OlStyleStroke color="rgb(0,100,255)" :width="6" />
        </OlStyle>
      </OlFeature>
    </OlSourceVector>
  </OlVectorLayer>
</template>

<script setup lang="ts">
import { useProjectStore } from '@/stores/Project'
import { fromLonLat } from 'ol/proj'
import { computed } from 'vue'
import { OlGeomLineString } from 'vue3-openlayers/geometries'
import { OlVectorLayer } from 'vue3-openlayers/layers'
import { OlFeature } from 'vue3-openlayers/map'
import { OlSourceVector } from 'vue3-openlayers/sources'
import { OlStyle, OlStyleStroke } from 'vue3-openlayers/styles'

const projectStore = useProjectStore()

const coordinates = computed(() => {
  const footway = projectStore.selectedPoi?.footway
  return Array.isArray(footway)
    ? footway
        .filter(
          (coord): coord is [number, number] =>
            Array.isArray(coord) &&
            coord.length === 2 &&
            typeof coord[0] === 'number' &&
            typeof coord[1] === 'number',
        )
        .map((coord) => fromLonLat(coord))
    : []
})
</script>
