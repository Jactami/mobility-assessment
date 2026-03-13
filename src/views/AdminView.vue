<template>
  <UIPageHeader :title="t('navigation.admin')" />

  <UISection :title="t('user.label', 2)">
    <UISkeletonLoader :loading="!profiles" height="10rem">
      <AdminProfileTable
        v-if="profiles"
        :profiles="profiles"
        @add="upsertUser"
        @update="upsertUser"
        @delete="deleteUser"
      />
    </UISkeletonLoader>
  </UISection>
</template>

<script setup lang="ts">
import AdminProfileTable from '@/components/admin/AdminProfileTable.vue'
import type { ProfileWithPassword } from '@/components/admin/types'
import UISkeletonLoader from '@/components/ui/skeleton/UISkeletonLoader.vue'
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

onMounted(() => {
  loadProfiles()
})

async function loadProfiles() {
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
  // Get user confirmation
  const confirmed = await confirmDialog({
    message: t('dialog.delete', { item: `${profile.first_name} ${profile.last_name}` }),
    confirm: t('action.delete'),
  })

  if (!confirmed) return

  // Delete user
  const { data, error } = await db.deleteUser(profile.id)

  if (error) {
    console.error(error)
    errorToast(t('notification.error.delete'))
  } else {
    // Refresh profile list
    profiles.value = data
    successToast(t('notification.success.delete'))
  }
}

async function upsertUser(profile: ProfileWithPassword) {
  const { data, error } = await db.setUser({
    id: profile.id,
    firstName: profile.first_name || '',
    lastName: profile.last_name || '',
    email: profile.email || '',
    password: profile.password,
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
    // Refresh profile list
    profiles.value = data
    successToast(t('notification.success.save'))
  }
}
</script>
