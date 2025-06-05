<template>
  <Layers.OlVectorLayer>
    <Sources.OlSourceVector>
      <Map.OlFeature>
        <!-- TODO: Replace circle with nice looking location marker -->
        <Geometries.OlGeomPoint :coordinates="center" />
        <Styles.OlStyle>
          <Styles.OlStyleCircle :radius="10">
            <Styles.OlStyleStroke :width="0" />
            <Styles.OlStyleFill color="red" />
          </Styles.OlStyleCircle>
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
