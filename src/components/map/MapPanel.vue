<template>
  <OlMap
    ref="mapRef"
    class="rounded-border block overflow-hidden"
    :class="{ 'opacity-60': disabled }"
    :style="{ height: `${height}px` }"
  >
    <OlView :center="center" :zoom="zoom" :min-zoom="3" :max-zoom="20" />

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
        v-if="map"
        :location="location"
        :radius="metersToPixels(map, location, props.project?.radius)"
      />

      <!-- Points of Interest Layer -->
      <MapLayerPois :pois="pois" />

      <!-- Location Layer -->
      <MapLayerLocation :location="location" />

      <!-- Overlay Layer -->
      <MapLayerOverlay v-if="!static" />
    </template>

    <!-- Map Control Buttons -->
    <template v-if="!disabled && !static">
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
import { fromLonLat } from 'ol/proj'
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from 'vue'
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
  static?: boolean // prevent user interaction -> export only
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

const mapRef = useTemplateRef<InstanceType<typeof OlMap>>('mapRef')
const map = computed(() => mapRef.value?.map)

// Default coordinates and zoom level centered on Germany
const lat = ref(51.1634)
const lon = ref(10.4477)

const center = ref(fromLonLat([lon.value, lat.value]))
const zoom = ref(5.7)

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

async function resetMap() {
  if (!props.project?.longitude || !props.project?.latitude || !props.project?.radius || !map.value)
    return

  // Update center and zoom based on project location
  lon.value = props.project.longitude
  lat.value = props.project.latitude
  center.value = fromLonLat([lon.value, lat.value])
  const offset = props.project.radius * 0.1
  zoom.value = zoomFromMeters(map.value, location.value, (props.project.radius + offset) * 2)

  // await next render to save current extent
  map.value.render()

  await nextTick()
  if (map.value) extent.value = map.value.getView().calculateExtent(map.value.getSize())
}

/**
 * Exports the current map view as an image.
 * @returns A promise that resolves to the exported image data URL.
 */
async function exportMap() {
  if (!map.value) return

  const size = 150
  const attribution = { text: attributions.join(' '), size: 16 }

  const img = await exportMapToImage(map.value, [size, size * 0.75], 192, 0.8, attribution)
  return img
}

onMounted(resetMap)

// Update map view when the project settings change
watch(() => [props.project?.latitude, props.project?.longitude, props.project?.radius], resetMap)

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
