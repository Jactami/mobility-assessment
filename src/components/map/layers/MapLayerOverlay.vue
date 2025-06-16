<template>
  <!-- Selection Layer -->
  <Layers.OlVectorLayer>
    <Sources.OlSourceVector>
      <Interactions.OlInteractionSelect :filter="selectInteractionFilter" @select="handleSelect">
        <Styles.OlStyle>
          <!-- Leave empty to prevent default selection style -->
        </Styles.OlStyle>
      </Interactions.OlInteractionSelect>
    </Sources.OlSourceVector>
  </Layers.OlVectorLayer>

  <!-- Map Overlay -->
  <Map.OlOverlay
    v-if="selectedPoi"
    :position="fromLonLat([selectedPoi.longitude, selectedPoi.latitude])"
    :auto-pan="{
      animation: {
        duration: 200,
      },
    }"
    positioning="bottom-center"
    :offset="[0, -28]"
  >
    <BaseCard class="relative max-w-96 min-w-64 bg-surface p-2">
      <div class="flex items-start justify-between gap-x-10">
        <strong>{{ selectedPoi.label }}</strong>
        <IconButton icon="close" @click="selectedPoi = null" />
      </div>
      <div class="mt-3 flex justify-between gap-x-10 text-sm text-on-surface-variant">
        <div class="flex items-center gap-x-1">
          <img
            :src="`/img/map/${selectedPoi.category}.svg`"
            :alt="t(`category.${selectedPoi.category}`)"
            class="inline-block h-5 w-5"
          />
          <span>{{ t(`category.${selectedPoi.category}`) }}</span>
        </div>
        <span>{{ n(selectedPoi.distance, 'meter') }}</span>
      </div>
    </BaseCard>
  </Map.OlOverlay>
</template>

<script setup lang="ts">
import BaseCard from '@/components/base/BaseCard.vue'
import IconButton from '@/components/icon/IconButton.vue'
import type { Poi } from '@/db/types'
import type { Feature } from 'ol'
import type { SelectEvent } from 'ol/interaction/Select'
import { fromLonLat } from 'ol/proj'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Interactions, Layers, Map, Sources, Styles } from 'vue3-openlayers'

const { n, t } = useI18n()

const selectedPoi = ref<Poi | null>(null)

function handleSelect(event: SelectEvent) {
  selectedPoi.value = event.selected[0].getProperties().poi
}

function selectInteractionFilter(feature: Feature) {
  return feature.get('poi') !== undefined
}
</script>
