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
import type { Profile } from '@/db/types'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const db = useDB()
const { t } = useI18n()
const { errorToast, successToast, confirmDialog } = useNotification()

const profiles = ref<Profile[]>()

const tableConfig: TableConfig<Profile> = {
  columns: [
    {
      key: 'last_name',
      label: 'Last Name',
      sort: 'raw',
    },
    {
      key: 'first_name',
      label: 'First Name',
      sort: 'raw',
    },
    {
      key: 'email',
      label: 'Email',
      sort: 'raw',
    },
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
      handler: deleteUser,
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

async function deleteUser(profile: Profile) {
  const confirmed = await confirmDialog(
    t('table.confirmDelete', { object: `${profile.first_name} ${profile.last_name}` }),
  )
  if (!confirmed) return

  const { data, error } = await db.deleteUser(profile.id)

  if (error) {
    console.error(error)
    errorToast('Fehler beim Löschen des Nutzers') // TODO: i18n
  } else {
    profiles.value = data
    successToast('Nutzer erfolgreich gelöscht') // TODO: i18n
  }
}

async function addUser() {
  const { data, error } = await db.createUser({
    firstName: 'New',
    lastName: 'User',
    email: 'test@bgw24.de',
    password: 'password123',
  })

  if (error) {
    console.error(error)
    errorToast('Fehler beim Erstellen des Nutzers') // TODO: i18n
  } else {
    profiles.value = data
    successToast('Nutzer erfolgreich erstellt') // TODO: i18n
  }
}
</script>
