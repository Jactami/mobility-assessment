<template>
  <OlVectorLayer>
    <OlSourceVector>
      <OlFeature>
        <OlGeomCircle :center="location" :radius="radius" />
        <OlStyle>
          <OlStyleStroke color="rgb(0,153,255)" :width="1" />
          <OlStyleFill color="rgba(255,255,255,0.30)" />
        </OlStyle>
      </OlFeature>
    </OlSourceVector>
  </OlVectorLayer>
</template>

<script setup lang="ts">
import type { Coordinate } from 'ol/coordinate'
import { OlGeomCircle } from 'vue3-openlayers/geometries'
import { OlVectorLayer } from 'vue3-openlayers/layers'
import { OlFeature } from 'vue3-openlayers/map'
import { OlSourceVector } from 'vue3-openlayers/sources'
import { OlStyle, OlStyleFill, OlStyleStroke } from 'vue3-openlayers/styles'

defineProps<{
  location: Coordinate
  radius: number
}>()
</script>
