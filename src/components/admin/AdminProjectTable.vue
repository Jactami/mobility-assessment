<template>
  <DataTable :data="projects" :config="tableConfig">
    <template #column-score="{ formatted, value }">
      <!-- Score Badge -->
      <UIBadge
        v-if="Number.isFinite(value)"
        severity="none"
        :style="{ backgroundColor: scoreToColor(Number(value)) }"
      >
        <div class="flex w-4 items-center justify-center text-on-surface-inverse">
          {{ formatted }}
        </div>
      </UIBadge>
    </template>
  </DataTable>

  <AdminProjectForm
    v-if="projectModel"
    v-model:open="modalOpen"
    :project="projectModel"
    :profiles="profiles"
    @submit="handleSubmit"
  />
</template>

<script setup lang="ts">
import DataTable from '@/components/table/DataTable.vue'
import type TableConfig from '@/components/table/types'
import UIBadge from '@/components/ui/UIBadge.vue'
import { useColorUtil } from '@/composables/util/color'
import { useUtil } from '@/composables/util/misc'
import type { Profile, Project } from '@/db/types'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AdminProjectForm from './AdminProjectForm.vue'

const props = defineProps<{
  projects: Project[]
  profiles: Profile[]
}>()

const emit = defineEmits<{
  (e: 'add'): void
  (e: 'update', project: Project): void
  (e: 'delete', project: Project): void
  (e: 'duplicate', project: Project): void
}>()

const { d, n, t } = useI18n()
const router = useRouter()
const { createAddress } = useUtil()
const { scoreToColor } = useColorUtil()

const modalOpen = ref(false)
const projectModel = ref<Project>()

const tableConfig: TableConfig<Project> = {
  columns: [
    {
      key: 'title',
      label: t('project.title'),
      sort: 'raw',
      width: 20,
    },
    {
      key: 'street',
      label: t('project.address'),
      formatter: (_, project) => createAddress({ ...project }),
      sort: 'formatted',
      width: 35,
    },
    {
      key: 'score',
      label: t('project.score'),
      formatter: (score) => (typeof score === 'number' ? n(score * 100, 'rounded') : undefined),
      sort: 'raw',
      align: 'center',
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
      key: 'created_at',
      label: t('project.createdAt'),
      formatter: (date) => d(String(date), 'short'),
      sort: 'raw',
      width: 10,
    },
    // TODO: Also add updated_at?
    {
      key: 'owner_id',
      label: t('project.owner'),
      formatter: (profileId) => {
        const profile = props.profiles.find((p) => p.id === profileId)
        return profile ? profile.email : ''
      },
      sort: 'formatted',
      width: 15,
    },
  ],
  presort: { key: 'title', order: 'asc' },
  searchable: true,
  pagination: true,
  actions: [
    {
      icon: 'open',
      label: t('action.open'),
      handler: (project) => {
        router.push({ name: 'project', params: { projectId: project.id } })
      },
    },
    {
      icon: 'edit',
      label: t('action.edit'),
      handler: (project) => {
        // Open modal and set project for editing
        modalOpen.value = true
        projectModel.value = { ...project }
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
  add: () => emit('add'),
}

function handleSubmit(newProject: Project) {
  modalOpen.value = false
  emit('update', newProject)
}
</script>
