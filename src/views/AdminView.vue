<template>
  <UISection title="Nutzer">
    <DataTable v-if="profiles" :data="profiles" :config="tableConfig" />
  </UISection>

  <UIModal v-model="modalOpen" :title="editProfile?.id ? t('common.edit') : t('common.add')">
    <FormKit
      id="edit-user-form"
      v-model="editProfile"
      #default="{ state: { valid } }"
      type="form"
      :actions="false"
      @submit="handleUpsertUser"
    >
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormKit
          type="text"
          name="last_name"
          :label="t('auth.lastName')"
          :placeholder="t('auth.lastName')"
          validation="required"
        />
        <FormKit
          type="text"
          name="first_name"
          :label="t('auth.firstName')"
          :placeholder="t('auth.firstName')"
          validation="required"
        />
        <FormKit
          type="email"
          name="email"
          :label="t('auth.email')"
          :placeholder="t('auth.email')"
          validation="required|email"
          outer-class="col-span-2"
        />
        <FormKit
          type="password"
          name="password"
          :label="
            editProfile.id ? `${t('auth.password')} (${t('common.optional')})` : t('auth.password')
          "
          :placeholder="t('auth.password')"
          :validation="!editProfile.id || editProfile.password_confirm ? 'required' : ''"
        />
        <FormKit
          type="password"
          name="password_confirm"
          :label="t('auth.passwordConfirm')"
          :placeholder="t('auth.passwordConfirm')"
          :validation="!editProfile?.id || editProfile?.password ? 'required|confirm' : 'confirm'"
        />
      </div>
      <div class="mt-4 flex justify-center gap-2">
        <UIButton type="submit" :disabled="!valid">{{ t('common.save') }}</UIButton>
        <UIButton flavor="secondary" @click="modalOpen = false">
          {{ t('common.cancel') }}
        </UIButton>
      </div>
    </FormKit>
  </UIModal>
</template>

<script setup lang="ts">
import DataTable from '@/components/table/DataTable.vue'
import type TableConfig from '@/components/table/types'
import UIButton from '@/components/ui/button/UIButton.vue'
import UIModal from '@/components/ui/UIModal.vue'
import UISection from '@/components/ui/UISection.vue'
import useDB from '@/composables/db'
import { useNotification } from '@/composables/notification'
import type { Profile } from '@/db/types'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const db = useDB()
const { t } = useI18n()
const { errorToast, successToast, confirmDialog } = useNotification()

const profiles = ref<Profile[]>()

const modalOpen = ref(false)
const editProfile = ref({
  id: '',
  first_name: '',
  last_name: '',
  email: '',
  password: undefined as string | undefined, // password might be optional for existing users
  password_confirm: undefined as string | undefined,
})

const tableConfig: TableConfig<Profile> = {
  columns: [
    {
      key: 'last_name',
      label: t('auth.lastName'),
      sort: 'raw',
      width: 30,
    },
    {
      key: 'first_name',
      label: t('auth.firstName'),
      sort: 'raw',
      width: 30,
    },
    {
      key: 'email',
      label: t('auth.email'),
      sort: 'raw',
      width: 40,
    },
  ],
  presort: { key: 'last_name', order: 'asc' },
  pagination: true,
  actions: [
    {
      icon: 'edit',
      label: t('common.edit'),
      handler: (profile) => {
        // Open modal and set profile for editing
        modalOpen.value = true
        editProfile.value = {
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          password: undefined, // Password should not be pre-filled
          password_confirm: undefined,
        }
      },
    },
    {
      icon: 'delete',
      label: t('common.delete'),
      handler: deleteUser,
    },
  ],
  add: addUser,
}

onMounted(() => {
  fetchProfiles()
})

async function fetchProfiles() {
  const { data, error } = await db.getProfiles()

  if (error) {
    console.error(error)
    errorToast(t('auth.loadError'))
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
    errorToast(t('auth.deleteError'))
  } else {
    profiles.value = data
    successToast(t('auth.deleteSuccess'))
  }
}

async function addUser() {
  // Open modal and reset profile for new user
  modalOpen.value = true
  editProfile.value = {
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    password: undefined,
    password_confirm: undefined,
  }
}

async function handleUpsertUser() {
  const { data, error } = await db.setUser({
    id: editProfile.value.id,
    firstName: editProfile.value.first_name,
    lastName: editProfile.value.last_name,
    email: editProfile.value.email,
    password: editProfile.value.password,
  })

  if (error) {
    console.error(error)
    if (error.code === '23505') {
      // Unique constraint violation (email already exists)
      errorToast(t('auth.emailExists'))
    } else {
      // General error
      errorToast(t('auth.upsertError'))
    }
  } else {
    profiles.value = data
    successToast(t('auth.upsertSuccess'))

    // Close modal after successful upsert
    modalOpen.value = false

    // Reset profile state
    editProfile.value = {
      id: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password_confirm: '',
    }
  }
}
</script>
