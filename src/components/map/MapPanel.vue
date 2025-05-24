<template>
  <div ref="mapEl" class="h-[500px] w-full" />
</template>

<script setup lang="ts">
import { useGeolocation } from '@vueuse/core'
import { defaults as defaultControls, FullScreen, ScaleLine, Zoom } from 'ol/control'
import TileLayer from 'ol/layer/Tile'
import Map from 'ol/Map'
import { fromLonLat } from 'ol/proj'
import { OSM } from 'ol/source'
import View from 'ol/View'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const mapEl = ref<HTMLDivElement | null>(null)

const { coords, pause } = useGeolocation({ immediate: true, enableHighAccuracy: true })

const map = new Map({
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  view: new View({
    center: fromLonLat([10.4477, 51.1634]), // Centered on Germany
    zoom: 5.5,
  }),
  controls: defaultControls().extend([
    new FullScreen({
      tipLabel: t('map.toggleFullscreen'),
    }),
    new Zoom({
      zoomInTipLabel: t('map.zoomIn'),
      zoomOutTipLabel: t('map.zoomOut'),
    }),
    new ScaleLine({
      units: 'metric',
    }),
  ]),
})

onMounted(() => {
  if (!mapEl.value) return

  map.setTarget(mapEl.value)
})

onUnmounted(() => {
  map.setTarget(undefined)
})

watch(coords, (newCoords) => {
  const { latitude, longitude } = newCoords
  if (latitude && longitude) {
    map.getView().setCenter(fromLonLat([longitude, latitude]))
    map.getView().setZoom(13)
    pause() // Pause geolocation updates after centering the map
  }
})
</script>
