<template>
  <Layers.OlVectorLayer :min-zoom="10">
    <Sources.OlSourceVector>
      <template v-for="poi in projectStore.pois" :key="poi.id">
        <!-- Marker: Append poi to properties for selection -->
        <Map.OlFeature :properties="{ poi }">
          <Geometries.OlGeomPoint :coordinates="fromLonLat([poi.longitude, poi.latitude])" />
          <Styles.OlStyle>
            <Styles.OlStyleIcon
              src="/img/map/marker.svg"
              :anchor="[0.5, 0.9]"
              :color="getColorByDomain(poi)"
            />
          </Styles.OlStyle>
        </Map.OlFeature>

        <!-- Icon; TODO: Add white background -->
        <Map.OlFeature>
          <Geometries.OlGeomPoint :coordinates="fromLonLat([poi.longitude, poi.latitude])" />
          <Styles.OlStyle>
            <Styles.OlStyleIcon
              :src="`/img/map/${poi.category}.svg`"
              :scale="0.5"
              color="#000"
              :anchor="[0.5, 1.4]"
            />
          </Styles.OlStyle>
        </Map.OlFeature>
      </template>
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

function getColorByDomain(poi: Poi) {
  return DOMAINS.find((domain) =>
    domain.categories.some((category) => category.name === poi.category),
  )?.color
}
</script>
