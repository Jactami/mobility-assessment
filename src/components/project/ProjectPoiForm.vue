<template>
  <UIModal v-model="open" :title="poi?.id ? t('common.edit') : t('common.add')">
    <FormKit
      id="edit-poi-form"
      v-model="poi"
      #default="{ state: { valid } }"
      type="form"
      :actions="false"
      @submit="handleSubmit"
    >
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormKit type="text" name="label" :label="t('poi.label')" :placeholder="t('poi.label')" />
        <FormKit
          type="select"
          name="category"
          :label="t('poi.category')"
          :placeholder="t('poi.category')"
          validation="required"
        >
          <optgroup
            v-for="dimension in geoConfig"
            :key="dimension.name"
            :label="t(`dimension.${dimension.name}`)"
          >
            <option
              v-for="category in dimension.categories.map((c) => c.name)"
              :key="category"
              :value="category"
            >
              {{ t(`category.${category}`) }}
            </option>
          </optgroup>
        </FormKit>
        <FormKit
          type="number"
          name="latitude"
          :label="t('poi.latitude')"
          :placeholder="t('poi.latitude')"
          step="any"
          number="float"
          min="-90"
          max="90"
          validation="required|number"
        />
        <FormKit
          type="number"
          name="longitude"
          :label="t('poi.longitude')"
          :placeholder="t('poi.longitude')"
          step="any"
          number="float"
          min="-180"
          max="180"
          validation="required|number"
        />
      </div>
      <div class="mt-4 flex justify-center gap-2">
        <UIButton type="submit" :disabled="!valid">{{ t('common.save') }}</UIButton>
        <UIButton variant="secondary" @click="open = false">
          {{ t('common.cancel') }}
        </UIButton>
      </div>
    </FormKit>
  </UIModal>
</template>

<script setup lang="ts">
import UIModal from '@/components/ui/UIModal.vue'
import UIButton from '@/components/ui/button/UIButton.vue'
import { usePoiService } from '@/composables/api/poi'
import { geoConfig } from '@/config/geo'
import type { Poi } from '@/db/types'
import { useProjectStore } from '@/stores/Project'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const projectStore = useProjectStore()
const { calculateDistance } = usePoiService()

const open = defineModel<boolean>('open')
const poi = defineModel<Partial<Poi>>('poi')

function handleSubmit() {
  if (!poi.value) return
  if (!projectStore.pois) return
  if (!projectStore.project) return
  if (!projectStore.project.latitude || !projectStore.project.longitude) return

  // Create a new POI object with the provided data
  const newPoi: Poi = {
    ...poi.value,
    latitude: poi.value.latitude || Infinity,
    longitude: poi.value.longitude || Infinity,
    category: poi.value.category ?? '',
    distance: Infinity, // This will be calculated later
    osm_id: -1,
    osm_type: 'node',
    project_id: projectStore.project.id,
  }

  // Calculate the distance from the project location
  newPoi.distance = calculateDistance(
    newPoi.latitude,
    newPoi.longitude,
    projectStore.project.latitude,
    projectStore.project.longitude,
  )

  const pois = [...projectStore.pois]

  if (poi.value?.id) {
    // Update existing POI
    const index = projectStore.pois?.findIndex((p) => p.id && p.id === poi.value?.id)
    if (index !== undefined && index >= 0) {
      pois[index] = { ...newPoi, id: poi.value.id, created_at: poi.value.created_at }
    }
  } else {
    // Add new POI
    pois.push({ ...newPoi, id: crypto.randomUUID(), created_at: new Date().toISOString() })
  }

  // Update the project store with the new POIs
  projectStore.updatePois(pois)

  // Reset state
  open.value = false
}
</script>
