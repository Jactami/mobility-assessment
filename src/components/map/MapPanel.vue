<template>
  <Map.OlMap
    ref="mapRef"
    class="h-[500px] overflow-hidden rounded-border"
    :class="{ 'opacity-60': disabled }"
  >
    <Map.OlView
      :center="center"
      :zoom="zoom"
      @change:resolution="(e) => (zoom = e.target.getZoom())"
    />

    <!-- Openstreetmap Layer -->
    <Layers.OlTileLayer>
      <Sources.OlSourceOsm />
    </Layers.OlTileLayer>

    <template
      v-if="
        mapRef &&
        projectStore.project?.longitude &&
        projectStore.project.latitude &&
        projectStore.project?.radius
      "
    >
      <!-- Radius Layer -->
      <MapLayerRadius
        :center="center"
        :radius="metersToPixels(mapRef.map as OlMap, center, projectStore.project.radius)"
      />

      <!-- Points of Interest Layer -->
      <MapLayerPois />

      <!-- Location Layer -->
      <MapLayerLocation :center="center" />

      <!-- Overlay Layer -->
      <MapLayerOverlay />
    </template>

    <!-- Map Control Buttons -->
    <template v-if="!disabled">
      <MapControls.OlZoomControl
        :zoom-in-tip-label="t('map.zoomIn')"
        :zoom-out-tip-label="t('map.zoomOut')"
      />
      <MapControls.OlFullscreenControl :tip-label="t('map.toggleFullscreen')" />
      <MapControls.OlZoomtoextentControl
        :extent="extent"
        label="🞋"
        :tip-label="t('map.resetMap')"
        class-name="ol-zoom-extent [&>button]:!text-[#be0030]"
      />
    </template>
    <MapControls.OlScalelineControl units="metric" />

    <!-- Map Interactions -->
    <Interactions.OlInteractionMouseWheelZoom :condition="() => !disabled" />
    <Interactions.OlInteractionPointer :condition="() => !disabled" />
  </Map.OlMap>
</template>

<script setup lang="ts">
import { useProjectStore } from '@/stores/Project'
import { useGeolocation } from '@vueuse/core'
import type { Extent } from 'ol/extent'
import type OlMap from 'ol/Map'
import { fromLonLat } from 'ol/proj'
import { computed, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Interactions, Layers, Map, MapControls, Sources } from 'vue3-openlayers'
import { useMapUtils } from './composables'
import MapLayerLocation from './layers/MapLayerLocation.vue'
import MapLayerOverlay from './layers/MapLayerOverlay.vue'
import MapLayerPois from './layers/MapLayerPois.vue'
import MapLayerRadius from './layers/MapLayerRadius.vue'

defineProps<{
  disabled?: boolean
}>()

const { t } = useI18n()
const { coords, pause } = useGeolocation({ immediate: true, enableHighAccuracy: true })
const projectStore = useProjectStore()
const { metersToPixels, zoomFromMeters } = useMapUtils()

const mapRef = ref<{ map: OlMap } | null>(null)

// Default coordinates and zoom level centered on Germany
const lat = ref(51.1634)
const lon = ref(10.4477)
const zoom = ref(5.7)

// Extent for the map view
const extent = ref<Extent>([])

// Computed center for the map view based on current location
const center = computed(() => fromLonLat([lon.value, lat.value]))

// Update and initialize map view when the project location changes
watch(
  () => projectStore.project,
  async (newProject) => {
    const { longitude, latitude, radius } = newProject || {}
    if (longitude && latitude && radius && mapRef.value) {
      // Update map center and zoom based on project location
      lon.value = longitude
      lat.value = latitude
      const offset = radius * 0.1
      zoom.value = zoomFromMeters(mapRef.value.map as OlMap, center.value, (radius + offset) * 2)

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
  if (projectStore.project?.longitude && projectStore.project?.latitude) {
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
