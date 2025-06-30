<template>
  <DataTable v-if="projectStore.pois" :config="config" :data="projectStore.pois">
    <template #item-category="{ value }">
      <div class="flex items-center gap-2">
        <img :src="`/img/map/${value}.svg`" :alt="t(`category.${value}`)" class="h-4" />
        <span>{{ t(`category.${value}`) }}</span>
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import DataTable from '@/components/table/DataTable.vue'
import { useLogger } from '@/composables/log'
import type { Poi } from '@/db/types'
import { useProjectStore } from '@/stores/Project'
import { useI18n } from 'vue-i18n'
import type TableConfig from '../table/types'

const { n, t } = useI18n()
const projectStore = useProjectStore()

const config: TableConfig<Poi> = {
  columns: [
    {
      key: 'label',
      label: t('poi.label'),
      sortable: true,
      formatter: (label, poi) => label || t(`category.${poi.category}`),
      width: 60,
    },
    {
      key: 'category',
      label: t('poi.category'),
      sortable: true,
      formatter: (category) => t(`category.${category}`),
      width: 30,
    },
    {
      key: 'distance',
      label: t('poi.distance'),
      sortable: true,
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
      label: t('poi.edit'),
      icon: 'edit',
      handler: (poi) => useLogger().log('Edit action for', poi),
    },
    {
      label: t('poi.delete'),
      icon: 'delete',
      handler: (poi) => useLogger().log('Delete action for', poi),
    },
  ],
}
</script>
