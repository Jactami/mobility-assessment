<template>
  <div ref="mapEl" class="h-[500px] w-full" />
</template>

<script setup lang="ts">
import { useProjectStore } from '@/stores/Project'
import { useGeolocation } from '@vueuse/core'
import { defaults as defaultControls, FullScreen, ScaleLine, Zoom } from 'ol/control'
import TileLayer from 'ol/layer/Tile'
import Map from 'ol/Map'
import { fromLonLat } from 'ol/proj'
import { OSM } from 'ol/source'
import View from 'ol/View'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMap } from './composables'

const { t } = useI18n()
const { drawCircleAround, drawLocation, resetLayers } = useMap()
const projectStore = useProjectStore()
const { coords, pause } = useGeolocation({ immediate: true, enableHighAccuracy: true })

const mapEl = ref<HTMLDivElement | null>(null)

// OpenLayers map configuration
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

// Reset the map view to a specific location
function resetMap(lon: number, lat: number) {
  resetLayers(map)
  map.getView().setCenter(fromLonLat([lon, lat]))
  map.getView().setZoom(13)
}

// Update and initialize map view when the project location changes
watch(
  () => [projectStore.project?.longitude, projectStore.project?.latitude],
  ([lon, lat]) => {
    if (lon && lat) {
      resetMap(lon, lat)
      drawCircleAround(map, lon, lat, 1000)
      drawLocation(map, lon, lat)
    }
  },
  { immediate: true },
)

// Watch for geolocation updates and center the map on the user's location
watch(coords, ({ latitude, longitude }) => {
  // If the project already has a location, pause geolocation updates
  if (projectStore.project?.longitude && projectStore.project?.latitude) {
    pause()
    return
  }

  // If geolocation coordinates are available, update map view
  if (latitude && longitude) {
    resetMap(longitude, latitude)
    pause() // Pause geolocation updates after first use
  }
})
</script>
