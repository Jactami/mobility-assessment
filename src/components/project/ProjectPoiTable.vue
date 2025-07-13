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
    <BaseButton @click="addPoi">{{ t('common.add') }}</BaseButton>
  </div>

  <ProjectPoiForm v-model:open="modalOpen" v-model:poi="editPoi" />
</template>

<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import DataTable from '@/components/table/DataTable.vue'
import type TableConfig from '@/components/table/types'
import { useNotification } from '@/composables/notification'
import type { Poi } from '@/db/types'
import { useProjectStore } from '@/stores/Project'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ProjectPoiForm from './ProjectPoiForm.vue'

const emit = defineEmits<{
  (e: 'poi-selected', poi: Poi): void
}>()

const { n, t } = useI18n()
const { confirmDialog } = useNotification()
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
      label: t('common.edit'),
      icon: 'edit',
      handler: (poi) => {
        modalOpen.value = true
        editPoi.value = { ...poi }
      },
    },
    {
      label: t('common.delete'),
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
</script>
