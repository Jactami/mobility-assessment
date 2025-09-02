<template>
  <OlMap
    ref="mapRef"
    class="overflow-hidden rounded-border"
    :class="{ 'opacity-60': disabled }"
    :style="{ height: `${height}px` }"
  >
    <OlView
      :center="center"
      :zoom="zoom"
      @change:resolution="handleResolutionChange"
      @change:center="(e) => (center = e.target.getCenter())"
    />

    <!-- Openstreetmap Layer -->
    <OlTileLayer>
      <OlSourceOSM :attributions="attributions" />
    </OlTileLayer>

    <template
      v-if="
        mapRef &&
        props.project?.longitude &&
        props.project?.latitude &&
        props.project?.radius &&
        !disabled
      "
    >
      <!-- Radius Layer -->
      <MapLayerRadius
        :location="location"
        :radius="metersToPixels(mapRef.map as Map, location, props.project?.radius)"
      />

      <!-- Points of Interest Layer -->
      <MapLayerPois :pois="pois" />

      <!-- Location Layer -->
      <MapLayerLocation :location="location" />

      <!-- Overlay Layer -->
      <MapLayerOverlay v-model="selectedPoi" />
    </template>

    <!-- Map Control Buttons -->
    <template v-if="!disabled">
      <OlZoomControl :zoom-in-tip-label="t('map.zoomIn')" :zoom-out-tip-label="t('map.zoomOut')" />
      <OlFullScreenControl :tip-label="t('map.toggleFullscreen')" />
      <OlZoomToExtentControl
        :extent="extent"
        label="🞋"
        :tip-label="t('map.resetMap')"
        class-name="ol-zoom-extent [&>button]:!text-[#be0030]"
      />
    </template>
    <OlScaleLineControl units="metric" />

    <!-- Map Interactions -->
    <OlInteractionMouseWheelZoom :use-anchor="true" />
    <OlInteractionPointer :handle-event="() => !disabled" />
  </OlMap>
</template>

<script setup lang="ts">
import type { Poi, Project } from '@/db/types'
import { useGeolocation } from '@vueuse/core'
import type { Extent } from 'ol/extent'
import type Map from 'ol/Map'
import type { ObjectEvent } from 'ol/Object'
import { fromLonLat } from 'ol/proj'
import { computed, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  OlFullScreenControl,
  OlScaleLineControl,
  OlZoomControl,
  OlZoomToExtentControl,
} from 'vue3-openlayers/controls'
import { OlInteractionMouseWheelZoom, OlInteractionPointer } from 'vue3-openlayers/interactions'
import { OlTileLayer } from 'vue3-openlayers/layers'
import { OlMap, OlView } from 'vue3-openlayers/map'
import { OlSourceOSM } from 'vue3-openlayers/sources'
import { useMapUtils } from './composables'
import MapLayerLocation from './layers/MapLayerLocation.vue'
import MapLayerOverlay from './layers/MapLayerOverlay.vue'
import MapLayerPois from './layers/MapLayerPois.vue'
import MapLayerRadius from './layers/MapLayerRadius.vue'

interface Props {
  project?: Project | null
  pois?: Poi[] | null
  height?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  pois: () => [],
  height: 500,
  disabled: false,
})

defineExpose({ exportMap })

const { t } = useI18n()
const { coords, pause } = useGeolocation({ immediate: true, enableHighAccuracy: true })
const { exportMapToImage, metersToPixels, zoomFromMeters } = useMapUtils()

// Define a model for the selected POI to be used across components
const selectedPoi = defineModel<Poi | null>()

const mapRef = ref<{ map: Map } | null>(null)

// Default coordinates and zoom level centered on Germany
const lat = ref(51.1634)
const lon = ref(10.4477)

const center = ref(fromLonLat([lon.value, lat.value]))
const zoom = ref(5.7)

const maxZoom = 20
const minZoom = 2

// Attribution text for the exported map image
const attributions: string[] = [
  `© ${new Date().getFullYear()} by BGW Digital`,
  `© OpenStreetMap contributors/`,
  `Lizenz: ODbL`,
]

// Extent for the map view
const extent = ref<Extent>([])

// Computed location center for the map view based on current location
const location = computed(() => fromLonLat([lon.value, lat.value]))

function resetMap(longitude: number, latitude: number, radius: number) {
  lon.value = longitude
  lat.value = latitude
  center.value = fromLonLat([longitude, latitude])
  const offset = radius * 0.1
  zoom.value = zoomFromMeters(mapRef.value?.map as Map, location.value, (radius + offset) * 2)
}

/**
 * Handles changes to the map resolution.
 * @param event The resolution change event.
 */
function handleResolutionChange(event: ObjectEvent) {
  const newZoom = event.target.getZoom()
  // Constrain zoom level to avoid recursive update calls
  zoom.value = Math.max(minZoom, Math.min(maxZoom, newZoom))
}

/**
 * Exports the current map view as an image.
 * @returns A promise that resolves to the exported image data URL.
 */
async function exportMap() {
  if (!mapRef.value) return

  const map = mapRef.value.map as Map
  const size = 200 // 4:3
  const attribution = { text: attributions.join(' '), size: 22 }

  const img = await exportMapToImage(map, [size, size * 0.75], 192, 0.8, attribution)
  return img
}

// Update and initialize map view when the project location changes
watch(
  () => props.project,
  async (newProject) => {
    const { longitude, latitude, radius } = newProject || {}
    if (longitude && latitude && radius && mapRef.value) {
      // Update map center and zoom based on project location
      resetMap(longitude, latitude, radius)

      // save extent based on the new project location
      await nextTick()
      extent.value = mapRef.value.map.getView().calculateExtent(mapRef.value.map.getSize())
    }
  },
  { immediate: true },
)

// Watch for geolocation updates and center the map on the user's location
watch(coords, ({ latitude, longitude }) => {
  // If the project already has a location, pause geolocation updates
  if (props.project?.longitude && props.project?.latitude) {
    pause()
    return
  }

  // If geolocation coordinates are available, update map center geolocation
  if (latitude && longitude) {
    lat.value = latitude
    lon.value = longitude
    zoom.value = 12
    pause() // Pause geolocation updates after first use
  }
})
</script>
