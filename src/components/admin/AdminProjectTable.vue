<template>
  <DataTable :data="projects" :config="tableConfig" />
</template>

<script setup lang="ts">
import DataTable from '@/components/table/DataTable.vue'
import type TableConfig from '@/components/table/types'
import { useUtil } from '@/composables/util/misc'
import type { Profile, Project } from '@/db/types'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const props = defineProps<{
  projects: Project[]
  profiles: Profile[]
}>()

const emit = defineEmits<{
  (e: 'delete', project: Project): void
  (e: 'duplicate', project: Project): void
}>()

const { n, t } = useI18n()
const router = useRouter()
const { createAddress } = useUtil()

const tableConfig: TableConfig<Project> = {
  columns: [
    {
      key: 'title',
      label: t('project.title'),
      sort: 'raw',
      width: 30,
    },
    {
      key: 'street',
      label: t('project.address'),
      formatter: (_, project) => createAddress({ ...project }),
      sort: 'formatted',
      width: 30,
    },
    {
      key: 'score',
      label: t('project.score'),
      formatter: (score) => (typeof score === 'number' ? n(score * 100, 'rounded') : undefined),
      sort: 'raw',
      width: 10,
    },
    {
      key: 'radius',
      label: t('project.radius'),
      formatter: (radius) => (typeof radius === 'number' ? n(radius, 'meter') : undefined),
      sort: 'raw',
      width: 10,
    },
    {
      key: 'owner_id',
      label: t('project.owner'),
      formatter: (profileId) => {
        const profile = props.profiles.find((p) => p.id === profileId)
        return profile ? profile.email : ''
      },
      sort: 'formatted',
      width: 20,
    },
  ],
  presort: { key: 'title', order: 'asc' },
  searchable: true,
  pagination: true,
  actions: [
    {
      icon: 'edit',
      label: t('action.edit'),
      handler: (project) => {
        router.push({ name: 'project', params: { projectId: project.id } })
      },
    },
    {
      icon: 'copy',
      label: t('action.duplicate'),
      handler: (project) => emit('duplicate', project),
    },
    {
      icon: 'delete',
      label: t('action.delete'),
      severity: 'danger',
      handler: (project) => emit('delete', project),
    },
  ],
}
</script>
