<template>
  <UIPageHeader :title="t('navigation.admin')" />

  <!-- TODO: Move user management to separate component -->
  <UISection title="Nutzer">
    <UISkeletonLoader :loading="!profiles" height="10rem">
      <DataTable v-if="profiles" :data="profiles" :config="tableConfig" />
    </UISkeletonLoader>
  </UISection>

  <UIForm
    id="edit-user-form"
    v-model:open="modalOpen"
    v-model:model="editProfile"
    :title="
      editProfile?.id
        ? t('action.editItem', { item: t('user.label') })
        : t('action.addItem', { item: t('user.label') })
    "
    @submit="handleUpsertUser"
  >
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FormKit
        type="text"
        name="first_name"
        :label="t('user.firstName')"
        :placeholder="t('user.firstName')"
        validation="required"
      />
      <FormKit
        type="text"
        name="last_name"
        :label="t('user.lastName')"
        :placeholder="t('user.lastName')"
        validation="required"
      />
      <FormKit
        type="email"
        name="email"
        :label="t('user.email')"
        :placeholder="t('user.email')"
        validation="required|email"
        outer-class="col-span-2"
      />
      <FormKit
        type="password"
        name="password"
        :label="
          editProfile.id ? `${t('user.password')} (${t('common.optional')})` : t('user.password')
        "
        :placeholder="t('user.password')"
        :validation="!editProfile.id || editProfile.password_confirm ? 'required' : ''"
      />
      <FormKit
        type="password"
        name="password_confirm"
        :label="t('auth.password.confirm')"
        :placeholder="t('auth.password.confirm')"
        :validation="!editProfile?.id || editProfile?.password ? 'required|confirm' : 'confirm'"
      />
    </div>
  </UIForm>
</template>

<script setup lang="ts">
import DataTable from '@/components/table/DataTable.vue'
import type TableConfig from '@/components/table/types'
import UISkeletonLoader from '@/components/ui/skeleton/UISkeletonLoader.vue'
import UIForm from '@/components/ui/UIForm.vue'
import UIPageHeader from '@/components/ui/UIPageHeader.vue'
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
      label: t('action.delete'),
      severity: 'danger',
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
    errorToast(t('notification.error.load'))
    profiles.value = []
  } else {
    profiles.value = data
  }
}

async function deleteUser(profile: Profile) {
  const confirmed = await confirmDialog({
    message: t('dialog.delete', { item: `${profile.first_name} ${profile.last_name}` }),
    confirm: t('action.delete'),
  })
  if (!confirmed) return

  const { data, error } = await db.deleteUser(profile.id)

  if (error) {
    console.error(error)
    errorToast(t('notification.error.delete'))
  } else {
    profiles.value = data
    successToast(t('notification.success.delete'))
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
      errorToast(t('auth.error.emailInUse'))
    } else {
      // General error
      errorToast(t('notification.error.save'))
    }
  } else {
    profiles.value = data
    successToast(t('notification.success.save'))

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
