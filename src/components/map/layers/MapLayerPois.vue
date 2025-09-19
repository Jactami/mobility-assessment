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

        <!-- Icon -->
        <OlFeature>
          <OlGeomPoint :coordinates="fromLonLat([poi.longitude, poi.latitude])" />
          <OlStyle>
            <OlStyleIcon
              :src="useIcon().getUrl(poi.category, categoryToColor(poi.category))"
              :scale="0.45"
            />
          </OlStyle>
        </OlFeature>
      </template>
    </OlSourceVector>
  </OlVectorLayer>
</template>

<script setup lang="ts">
import { useIcon } from '@/composables/icon'
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
