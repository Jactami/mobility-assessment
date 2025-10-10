<template>
  <DataTable :config="config" :data="pois">
    <template #item-category="{ value }">
      <div class="flex items-center gap-2">
        <div
          class="bg-surface flex size-5 items-center justify-center rounded-full border-2 p-0.5"
          :style="{ borderColor: categoryToColor(String(value)) }"
        >
          <ProjectCategoryIcon :category="String(value)" class="size-full" />
        </div>
        <span>{{ t(`category.${value}`) }}</span>
      </div>
    </template>
  </DataTable>

  <ProjectPoiForm v-if="modalOpen" v-model:open="modalOpen" :poi="editPoi" />
</template>

<script setup lang="ts">
import DataTable from '@/components/table/DataTable.vue'
import type TableConfig from '@/components/table/types'
import { useNotification } from '@/composables/notification'
import { useColorUtil } from '@/composables/util/color'
import type { Poi } from '@/db/types'
import { useProjectStore } from '@/stores/Project'
import { computed, ref, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
import ProjectCategoryIcon from '../category/ProjectCategoryIcon.vue'
import ProjectPoiForm from './ProjectPoiForm.vue'

defineProps<{
  pois: Poi[]
}>()

const { n, t } = useI18n()
const { confirmDialog } = useNotification()
const projectStore = useProjectStore()
const { categoryToColor } = useColorUtil()

const modalOpen = ref(false)

const defaultLat = computed(() => projectStore.project?.latitude ?? 0)
const defaultLon = computed(() => projectStore.project?.longitude ?? 0)

const editPoi = shallowRef<Partial<Poi>>({
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
      label: t('project.poi'),
      sort: 'formatted',
      formatter: (label, poi) => label || t(`category.${poi.category}`),
      width: 60,
    },
    {
      key: 'category',
      label: t('project.category'),
      sort: 'formatted',
      formatter: (category) => t(`category.${category}`),
      width: 30,
    },
    {
      key: 'distance',
      label: t('project.distance'),
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
      label: t('map.showOnMap'),
      icon: 'map',
      handler: (poi) => {
        projectStore.setSelectedPoi(poi)

        // Not to happy about this direct DOM access, but works for now
        document.getElementById('map-panel')?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      },
    },
    {
      label: t('action.edit'),
      icon: 'edit',
      handler: (poi) => {
        modalOpen.value = true
        editPoi.value = { ...poi }
      },
    },
    {
      label: t('action.delete'),
      icon: 'delete',
      severity: 'danger',
      handler: deletePoi,
    },
  ],
  add: projectStore.project?.latitude && projectStore.project?.longitude ? addPoi : undefined,
  export: true,
}

async function deletePoi(poi: Poi) {
  if (!projectStore.pois) return

  // Confirm deletion
  const confirmation = await confirmDialog({
    message: t('dialog.delete', { item: poi.label || t(`category.${poi.category}`) }),
    confirm: t('action.delete'),
  })
  if (!confirmation) return

  // Remove the POI from the store
  const newPois = projectStore.pois.filter((p) => p !== poi)
  projectStore.updateProjectState({ pois: newPois })
}

function addPoi() {
  if (!projectStore.project?.latitude || !projectStore.project?.longitude) return

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
