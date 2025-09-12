<template>
  <OlVectorLayer :min-zoom="10">
    <OlSourceVector>
      <template v-for="poi in pois" :key="poi.id">
        <!-- Marker: Append poi to properties for selection -->
        <OlFeature :properties="{ poi }">
          <OlGeomPoint :coordinates="fromLonLat([poi.longitude, poi.latitude])" />
          <OlStyle>
            <!-- <Styles.OlStyleIcon
              src="/img/icons/marker.svg"
              :anchor="[0.5, 0.9]"
              :color="categoryToColor(poi.category)"
            /> -->
            <OlStyleCircle :radius="10">
              <OlStyleFill color="#fff" />
              <OlStyleStroke :color="categoryToColor(poi.category)" :width="2" />
            </OlStyleCircle>
          </OlStyle>
        </OlFeature>

        <!-- Icon; TODO: Add white background -->
        <OlFeature>
          <OlGeomPoint :coordinates="fromLonLat([poi.longitude, poi.latitude])" />
          <OlStyle>
            <OlStyleIcon
              :src="`/img/icons/${poi.category}.svg`"
              :scale="0.45"
              :color="categoryToColor(poi.category)"
            />
          </OlStyle>
        </OlFeature>
      </template>
    </OlSourceVector>
  </OlVectorLayer>
</template>

<script setup lang="ts">
import { useColorUtil } from '@/composables/util/color'
import type { Poi } from '@/db/types'
import { fromLonLat } from 'ol/proj'
import { OlGeomPoint } from 'vue3-openlayers/geometries'
import { OlVectorLayer } from 'vue3-openlayers/layers'
import { OlFeature } from 'vue3-openlayers/map'
import { OlSourceVector } from 'vue3-openlayers/sources'
import {
  OlStyle,
  OlStyleCircle,
  OlStyleFill,
  OlStyleIcon,
  OlStyleStroke,
} from 'vue3-openlayers/styles'

defineProps<{
  pois: Poi[] | null
}>()

const { categoryToColor } = useColorUtil()
</script>
