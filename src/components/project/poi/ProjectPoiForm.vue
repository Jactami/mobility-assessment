<template>
  <UIForm
    id="edit-poi-form"
    v-model:open="open"
    v-model:model="model"
    :title="
      poi?.id
        ? t('action.editItem', { item: t('project.poi') })
        : t('action.addItem', { item: t('project.poi') })
    "
    @submit="handleSubmit"
  >
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FormKit type="text" name="label" :label="t('project.poi')" :placeholder="t('project.poi')" />
      <FormKit
        type="select"
        name="category"
        :label="t('project.category')"
        :placeholder="t('project.category')"
        validation="required"
      >
        <optgroup
          v-for="factor in factorConfig"
          :key="factor.name"
          :label="t(`factor.${factor.name}`)"
        >
          <option
            v-for="category in factor.categories.map((c) => c.name)"
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
        :label="t('project.latitude')"
        :placeholder="t('project.latitude')"
        step="any"
        number="float"
        min="-90"
        max="90"
        validation="required|number"
      />
      <FormKit
        type="number"
        name="longitude"
        :label="t('project.longitude')"
        :placeholder="t('project.longitude')"
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
import { useRouteService } from '@/composables/api/route'
import { useNotification } from '@/composables/notification'
import { factorConfig } from '@/config/app'
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
const { data, error, getRoute } = useRouteService()
const { errorToast } = useNotification()

async function handleSubmit() {
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
    footway: null, // This will be set later
    distance: Infinity, // This will be calculated later
    osm_id: -1,
    osm_type: 'node',
    project_id: projectStore.project.id,
  }

  // Get the route and distance from the project location to the POI
  await getRoute(
    projectStore.project.latitude,
    projectStore.project.longitude,
    newPoi.latitude,
    newPoi.longitude,
  )

  if (error.value) {
    errorToast(t('notification.error.default'))
    console.error(error.value)
    return
  }

  newPoi.footway = data.value?.route
  newPoi.distance = data.value?.distance
    ? data.value.distance
    : calculateDistance(
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
