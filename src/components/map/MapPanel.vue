<template>
  <div ref="mapEl" class="h-[500px] w-full" />
</template>

<script setup lang="ts">
import TileLayer from 'ol/layer/Tile'
import Map from 'ol/Map'
import XYZ from 'ol/source/XYZ'
import View from 'ol/View'
import { onMounted, onUnmounted, ref } from 'vue'

const mapEl = ref<HTMLDivElement | null>(null)

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new XYZ({
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      }),
    }),
  ],
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
})

onMounted(() => {
  if (!mapEl.value) return

  map.setTarget(mapEl.value)
})

onUnmounted(() => {
  map.setTarget(undefined)
})
</script>
