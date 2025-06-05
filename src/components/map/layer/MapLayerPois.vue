<template>
  <Layers.OlVectorLayer>
    <Sources.OlSourceVector>
      <Map.OlFeature v-for="(coordinate, index) in coordinates" :key="index">
        <!-- TODO: Replace circles with nice looking poi markers -->
        <Geometries.OlGeomPoint :coordinates="coordinate" />
        <Styles.OlStyle>
          <Styles.OlStyleCircle :radius="5">
            <Styles.OlStyleStroke :width="0" />
            <Styles.OlStyleFill color="blue" />
          </Styles.OlStyleCircle>
        </Styles.OlStyle>
      </Map.OlFeature>
    </Sources.OlSourceVector>
  </Layers.OlVectorLayer>
</template>

<script setup lang="ts">
import { fromLonLat } from 'ol/proj'
import { Geometries, Layers, Map, Sources, Styles } from 'vue3-openlayers'

// temporary hardcoded points of interest (POIs)
const pois = [
  [10.887, 49.8913],
  [10.8905, 49.8984],
  [10.9002, 49.894],
  [10.8804, 49.8945],
  [10.879, 49.901],
  [10.8933, 49.8868],
  [10.9055, 49.8897],
  [10.8832, 49.889],
  [10.8965, 49.9025],
  [10.8998, 49.888],
]

const coordinates = pois.map((poi) => fromLonLat(poi))
</script>
