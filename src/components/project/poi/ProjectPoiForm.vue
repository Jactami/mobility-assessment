<template>
  <UIForm
    id="edit-poi-form"
    v-model:open="open"
    v-model:model="model"
    :title="poi?.id ? t('common.edit') : t('common.add')"
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
  </UIForm>
</template>

<script setup lang="ts">
import UIForm from '@/components/ui/UIForm.vue'
import { usePoiService } from '@/composables/api/poi'
import { geoConfig } from '@/config/geo'
import type { Poi } from '@/db/types'
import { useProjectStore } from '@/stores/Project'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  poi: Partial<Poi>
}>()

const open = defineModel<boolean>('open')

const model = ref<Partial<Poi>>({ ...props.poi })

const { t } = useI18n()
const projectStore = useProjectStore()
const { calculateDistance } = usePoiService()

function handleSubmit() {
  if (!model.value) return
  if (!projectStore.pois) return
  if (!projectStore.project) return
  if (!projectStore.project.latitude || !projectStore.project.longitude) return

  // Create a new POI object with the provided data
  const newPoi: Poi = {
    ...model.value,
    latitude: model.value.latitude || Infinity,
    longitude: model.value.longitude || Infinity,
    category: model.value.category ?? '',
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

  if (model.value?.id) {
    // Update existing POI
    const index = projectStore.pois?.findIndex((p) => p.id && p.id === model.value?.id)
    if (index !== undefined && index >= 0) {
      pois[index] = { ...newPoi, id: model.value.id, created_at: model.value.created_at }
    }
  } else {
    // Add new POI
    pois.push({ ...newPoi, id: crypto.randomUUID(), created_at: new Date().toISOString() })
  }

  // Update the project store with the new POIs
  projectStore.updateProjectState({ pois })

  // Reset state
  open.value = false
}
</script>
