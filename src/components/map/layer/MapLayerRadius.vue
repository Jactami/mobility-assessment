<template>
  <Layers.OlVectorLayer>
    <Sources.OlSourceVector>
      <Map.OlFeature>
        <Geometries.OlGeomCircle :center="center" :radius="radius" />
        <Styles.OlStyle>
          <Styles.OlStyleStroke color="rgb(0,153,255)" :width="1" />
          <Styles.OlStyleFill color="rgba(255,255,255,0.30)" />
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
  radius: number
}>()
</script>
