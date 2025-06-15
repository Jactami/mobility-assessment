<template>
  <Layers.OlVectorLayer>
    <Sources.OlSourceVector>
      <Map.OlFeature>
        <Geometries.OlGeomPoint :coordinates="center" />
        <Styles.OlStyle>
          <Styles.OlStyleIcon src="/img/map/marker.svg" :anchor="[0.5, 0.9]" color="#ea4335" />
        </Styles.OlStyle>
      </Map.OlFeature>
    </Sources.OlSourceVector>
  </Layers.OlVectorLayer>
</template>

<script setup lang="ts">
import type { Coordinate } from 'ol/coordinate'
import { Geometries, Layers, Map, Sources, Styles } from 'vue3-openlayers'

defineProps<{
  center: Coordinate
}>()
</script>
