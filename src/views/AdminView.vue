<template>
  <BaseSection title="Nutzer">
    <template v-if="profiles">
      <DataTable :data="profiles" :config="tableConfig" />

      <div class="mt-4 flex justify-end">
        <BaseButton @click="addUser">Add User</BaseButton>
      </div>
    </template>
  </BaseSection>
</template>

<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import BaseSection from '@/components/base/BaseSection.vue'
import DataTable from '@/components/table/DataTable.vue'
import type TableConfig from '@/components/table/types'
import useDB from '@/composables/db'
import { useLogger } from '@/composables/log'
import { useNotification } from '@/composables/notification'
import { supabase } from '@/db'
import type { Profile } from '@/db/types'
import { onMounted, ref } from 'vue'

const db = useDB()
const { errorToast } = useNotification()

const profiles = ref<Profile[]>()

const tableConfig: TableConfig<Profile> = {
  columns: [
    {
      key: 'last_name',
      label: 'Last Name',
      sortable: true,
      formatter: (lastName) => lastName,
    },
    {
      key: 'first_name',
      label: 'First Name',
      sortable: true,
      formatter: (firstName) => firstName,
    },
    // TODO: Add email column to profile table
    // {
    //   key: 'email',
    //   label: 'Email',
    //   sortable: true,
    //   formatter: (email) => email,
    // },
  ],
  presort: { key: 'last_name', order: 'asc' },
  pagination: true,
  actions: [
    {
      icon: 'edit',
      label: 'Edit',
      handler: (profile) => {
        useLogger().log('Edit profile:', profile)
      },
    },
    {
      icon: 'delete',
      label: 'Delete',
      handler: (profile) => {
        useLogger().log('Delete profile:', profile)
      },
    },
  ],
}

onMounted(() => {
  fetchProfiles()
})

async function fetchProfiles() {
  const { data, error } = await db.getProfiles()

  if (error) {
    console.error(error)
    errorToast('Fehler beim Laden der Profile') // TODO: i18n
    profiles.value = []
  } else {
    profiles.value = data
  }
}

async function addUser() {
  const { data, error } = await supabase.rpc('create_user', {
    first_name: 'Test',
    last_name: 'BGW',
    email: 'test@bgw24.de',
    password: 'test', // make sure to change this later!
  })

  if (error) {
    console.error('Error creating user:', error)
  } else {
    console.log('User created with ID:', data)
  }
}
</script>
