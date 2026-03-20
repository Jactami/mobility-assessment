<template>
  <DataTable :data="profiles" :config="tableConfig">
    <template #column-is_disabled="{ formatted, value }">
      <UIBadge v-if="value" severity="danger">
        {{ formatted }}
      </UIBadge>
    </template>
    <template #column-expires_at="{ formatted, value }">
      <UIBadge v-if="value" :severity="new Date(String(value)) >= today ? 'warning' : 'danger'">
        {{ formatted }}
      </UIBadge>
    </template>
  </DataTable>

  <AdminProfileForm v-model:open="modalOpen" :profile="profileModel" @submit="handleSubmit" />
</template>

<script setup lang="ts">
import DataTable from '@/components/table/DataTable.vue'
import type TableConfig from '@/components/table/types'
import UIBadge from '@/components/ui/UIBadge.vue'
import type { Profile } from '@/db/types'
import { computed, ref } from 'vue'
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

const { d, t } = useI18n()

const modalOpen = ref(false)
const profileModel = ref<Profile>()

const today = computed(() => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
})

const tableConfig: TableConfig<Profile> = {
  columns: [
    {
      key: 'last_name',
      label: t('user.lastName'),
      sort: 'raw',
      width: 25,
    },
    {
      key: 'first_name',
      label: t('user.firstName'),
      sort: 'raw',
      width: 25,
    },
    {
      key: 'email',
      label: t('user.email'),
      sort: 'raw',
      width: 30,
    },
    {
      key: 'is_disabled',
      label: t('user.status'),
      formatter: (disabled) => (disabled ? t('user.disabled') : ''),
      sort: 'raw',
      width: 10,
    },
    {
      key: 'expires_at',
      label: t('user.expiresAt'),
      formatter: (date) => (date ? d(String(date), 'short') : ''),
      sort: 'raw',
      width: 10,
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
      disabled: (profile) => profile.user_role === 'admin', // Prevent deletion of admin users
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
