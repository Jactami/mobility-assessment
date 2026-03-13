<template>
  <DataTable :data="profiles" :config="tableConfig" />

  <AdminProfileForm v-model:open="modalOpen" :profile="profileModel" @submit="handleSubmit" />
</template>

<script setup lang="ts">
import DataTable from '@/components/table/DataTable.vue'
import type TableConfig from '@/components/table/types'
import type { Profile } from '@/db/types'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AdminProfileForm from './AdminProfileForm.vue'
import type { ProfileWithPassword } from './types'

defineProps<{
  profiles: Profile[]
}>()

const emit = defineEmits<{
  (e: 'add', profile: Partial<Profile>): void
  (e: 'update', profile: Partial<Profile>): void
  (e: 'delete', profile: Profile): void
}>()

const { t } = useI18n()

const modalOpen = ref(false)
const profileModel = ref<Profile>()

const tableConfig: TableConfig<Profile> = {
  columns: [
    {
      key: 'last_name',
      label: t('user.lastName'),
      sort: 'raw',
      width: 30,
    },
    {
      key: 'first_name',
      label: t('user.firstName'),
      sort: 'raw',
      width: 30,
    },
    {
      key: 'email',
      label: t('user.email'),
      sort: 'raw',
      width: 40,
    },
  ],
  presort: { key: 'last_name', order: 'asc' },
  searchable: true,
  pagination: true,
  actions: [
    {
      icon: 'edit',
      label: t('action.edit'),
      handler: (profile) => {
        // Open modal and set profile for editing
        modalOpen.value = true
        profileModel.value = { ...profile }
      },
    },
    {
      icon: 'delete',
      label: t('action.delete'),
      severity: 'danger',
      handler: (profile) => emit('delete', profile),
    },
  ],
  add: () => {
    // Open modal and reset profile model for new entry
    modalOpen.value = true
    profileModel.value = undefined
  },
}

function handleSubmit(newProfile: ProfileWithPassword) {
  if (newProfile.id) {
    // Update existing profile
    emit('update', newProfile)
  } else {
    // Add new profile
    emit('add', newProfile)
  }
}
</script>
