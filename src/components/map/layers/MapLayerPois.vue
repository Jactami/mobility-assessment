<template>
  <Layers.OlVectorLayer>
    <Sources.OlSourceVector>
      <Map.OlFeature v-for="(coordinate, index) in coordinates" :key="index">
        <!-- TODO: Replace circles with nice looking poi markers -->
        <Geometries.OlGeomPoint :coordinates="coordinate" />
        <Styles.OlStyle>
          <Styles.OlStyleCircle :radius="4">
            <Styles.OlStyleStroke :width="0" />
            <Styles.OlStyleFill color="blue" />
          </Styles.OlStyleCircle>
        </Styles.OlStyle>
      </Map.OlFeature>
    </Sources.OlSourceVector>
  </Layers.OlVectorLayer>
</template>

<script setup lang="ts">
import { useProjectStore } from '@/stores/Project'
import { fromLonLat } from 'ol/proj'
import { computed } from 'vue'
import { Geometries, Layers, Map, Sources, Styles } from 'vue3-openlayers'

const projectStore = useProjectStore()

const coordinates = computed(() =>
  projectStore.pois?.map((poi) => fromLonLat([poi.longitude, poi.latitude])),
)
</script>
