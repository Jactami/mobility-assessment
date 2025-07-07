<template>
  <DataTable v-if="projectStore.pois" :config="config" :data="projectStore.pois">
    <template #item-category="{ value }">
      <div class="flex items-center gap-2">
        <img :src="`/img/map/${value}.svg`" :alt="t(`category.${value}`)" class="h-4" />
        <span>{{ t(`category.${value}`) }}</span>
      </div>
    </template>
  </DataTable>
  <div class="mt-4 flex justify-end">
    <BaseButton @click="addPoi">{{ t('poi.add') }}</BaseButton>
  </div>

  <BaseModal v-model="modalOpen" :title="editPoi.id ? t('poi.edit') : t('poi.add')">
    <FormKit
      id="edit-poi-form"
      v-model="editPoi"
      #default="{ state: { valid } }"
      type="form"
      :actions="false"
      @submit="handleSubmitPoi"
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
            v-for="domain in DOMAINS"
            :key="domain.name"
            :label="t(`domain.${domain.name}`)"
          >
            <option
              v-for="category in domain.categories.map((c) => c.name)"
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
        <BaseButton type="submit" :disabled="!valid">{{ t('common.submit') }}</BaseButton>
        <BaseButton flavor="secondary" @click="modalOpen = false">
          {{ t('common.cancel') }}
        </BaseButton>
      </div>
    </FormKit>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import DataTable from '@/components/table/DataTable.vue'
import type TableConfig from '@/components/table/types'
import { useNotification } from '@/composables/notification'
import { usePoiService } from '@/composables/poi'
import { DOMAINS } from '@/constants'
import type { Poi } from '@/db/types'
import { useProjectStore } from '@/stores/Project'
import { computed, defineEmits, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'poi-selected', poi: Poi): void
}>()

const { n, t } = useI18n()
const { confirmDialog } = useNotification()
const { calculateDistance } = usePoiService()
const projectStore = useProjectStore()

const modalOpen = ref(false)

const defaultLat = computed(() => projectStore.project?.latitude ?? 0)
const defaultLon = computed(() => projectStore.project?.longitude ?? 0)

const editPoi = ref<Partial<Poi>>({
  id: undefined,
  label: '',
  category: '',
  latitude: defaultLat.value,
  longitude: defaultLon.value,
})

const config: TableConfig<Poi> = {
  columns: [
    {
      key: 'label',
      label: t('poi.label'),
      sort: 'formatted',
      formatter: (label, poi) => label || t(`category.${poi.category}`),
      width: 60,
    },
    {
      key: 'category',
      label: t('poi.category'),
      sort: 'formatted',
      formatter: (category) => t(`category.${category}`),
      width: 30,
    },
    {
      key: 'distance',
      label: t('poi.distance'),
      sort: 'raw',
      formatter: (distance) => n(Number(distance), 'meter'),
      width: 10,
    },
  ],
  searchable: true,
  pagination: true,
  presort: {
    key: 'distance',
    order: 'asc',
  },
  actions: [
    {
      label: t('poi.viewOnMap'),
      icon: 'map',
      handler: (poi) => emit('poi-selected', poi),
    },
    {
      label: t('poi.edit'),
      icon: 'edit',
      handler: (poi) => {
        modalOpen.value = true
        editPoi.value = { ...poi }
      },
    },
    {
      label: t('poi.delete'),
      icon: 'delete',
      handler: deletePoi,
    },
  ],
}

async function deletePoi(poi: Poi) {
  if (!projectStore.pois) return

  // Confirm deletion
  const confirmation = await confirmDialog(
    t('table.confirmDelete', { object: poi.label || t(`category.${poi.category}`) }),
  )
  if (!confirmation) return

  // Remove the POI from the store
  const newPois = projectStore.pois.filter((p) => p !== poi)
  projectStore.updatePois(newPois)
}

function addPoi() {
  modalOpen.value = true
  editPoi.value = {
    id: undefined,
    label: '',
    category: '',
    latitude: defaultLat.value,
    longitude: defaultLon.value,
  }
}

function handleSubmitPoi() {
  if (!editPoi.value) return
  if (!projectStore.pois) return
  if (!projectStore.project) return
  if (!projectStore.project.latitude || !projectStore.project.longitude) return

  const newPoi: Poi = {
    ...editPoi.value,
    latitude: editPoi.value.latitude ?? defaultLat.value,
    longitude: editPoi.value.longitude ?? defaultLon.value,
    category: editPoi.value.category ?? '',
    distance: Infinity, // This will be calculated later
    osm_id: -1,
    osm_type: 'node',
    project_id: projectStore.project.id,
  }

  newPoi.distance = calculateDistance(
    newPoi.latitude,
    newPoi.longitude,
    projectStore.project.latitude,
    projectStore.project.longitude,
  )

  const pois = [...projectStore.pois]

  if (editPoi.value?.id) {
    // Update existing POI
    const index = projectStore.pois?.findIndex((p) => p.id && p.id === editPoi.value?.id)
    if (index !== undefined && index >= 0) {
      pois[index] = { ...newPoi, id: editPoi.value.id, created_at: editPoi.value.created_at }
    }
  } else {
    // Add new POI
    pois.push({ ...newPoi, id: crypto.randomUUID(), created_at: new Date().toISOString() })
  }

  // Update the project store with the new POIs
  projectStore.updatePois(pois)

  // Reset state
  modalOpen.value = false
}
</script>
