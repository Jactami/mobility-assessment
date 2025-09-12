<template>
  <OlVectorLayer>
    <OlSourceVector>
      <OlFeature>
        <OlGeomPoint :coordinates="location" />
        <OlStyle>
          <OlStyleIcon src="/img/icons/center.svg" color="#be0030" />
        </OlStyle>
      </OlFeature>
    </OlSourceVector>
  </OlVectorLayer>
</template>

<script setup lang="ts">
import type { Coordinate } from 'ol/coordinate'
import { OlGeomPoint } from 'vue3-openlayers/geometries'
import { OlVectorLayer } from 'vue3-openlayers/layers'
import { OlFeature } from 'vue3-openlayers/map'
import { OlSourceVector } from 'vue3-openlayers/sources'
import { OlStyle, OlStyleIcon } from 'vue3-openlayers/styles'

defineProps<{
  location: Coordinate
}>()
</script>
