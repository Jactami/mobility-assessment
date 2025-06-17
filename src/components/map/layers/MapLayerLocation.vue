<template>
  <Layers.OlVectorLayer>
    <Sources.OlSourceVector>
      <Map.OlFeature>
        <Geometries.OlGeomPoint :coordinates="location" />
        <Styles.OlStyle>
          <Styles.OlStyleIcon src="/img/map/center.svg" :anchor="[0.5, 0.9]" color="#be0030" />
        </Styles.OlStyle>
      </Map.OlFeature>
    </Sources.OlSourceVector>
  </Layers.OlVectorLayer>
</template>

<script setup lang="ts">
import type { Coordinate } from 'ol/coordinate'
import { Geometries, Layers, Map, Sources, Styles } from 'vue3-openlayers'

defineProps<{
  location: Coordinate
}>()
</script>
