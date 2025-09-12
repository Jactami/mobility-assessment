<template>
  <DataTable v-if="projectStore.pois" :config="config" :data="projectStore.pois">
    <template #item-category="{ value }">
      <div class="flex items-center gap-2">
        <div
          class="flex size-5 items-center justify-center rounded-full border-2 bg-surface p-0.5"
          :style="{ borderColor: categoryToColor(String(value)) }"
        >
          <ProjectCategoryIcon :category="String(value)" class="size-full" />
        </div>
        <span>{{ t(`category.${value}`) }}</span>
      </div>
    </template>
  </DataTable>

  <ProjectPoiForm v-model:open="modalOpen" v-model:poi="editPoi" />
</template>

<script setup lang="ts">
import DataTable from '@/components/table/DataTable.vue'
import type TableConfig from '@/components/table/types'
import { useNotification } from '@/composables/notification'
import { useColorUtil } from '@/composables/util/color'
import type { Poi } from '@/db/types'
import { useProjectStore } from '@/stores/Project'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ProjectCategoryIcon from './ProjectCategoryIcon.vue'
import ProjectPoiForm from './ProjectPoiForm.vue'

const emit = defineEmits<{
  (e: 'poi-selected', poi: Poi): void
}>()

const { n, t } = useI18n()
const { confirmDialog } = useNotification()
const projectStore = useProjectStore()
const { categoryToColor } = useColorUtil()

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
  add: addPoi,
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
