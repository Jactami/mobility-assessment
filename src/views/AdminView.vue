<template>
  <UIPageHeader :title="t('navigation.admin')" />

  <UISection :title="t('user.label', 2)">
    <UISkeletonLoader :loading="loading" height="10rem">
      <AdminProfileTable
        v-if="profiles"
        :profiles="profiles"
        @add="upsertUser"
        @update="upsertUser"
        @delete="deleteUser"
      />
    </UISkeletonLoader>
  </UISection>

  <UISection :title="t('project.label', 2)">
    <UISkeletonLoader :loading="loading" height="10rem">
      <AdminProjectTable
        v-if="projects && profiles"
        :projects="projects"
        :profiles="profiles"
        @copy="copyProject"
        @delete="deleteProject"
      />
    </UISkeletonLoader>
  </UISection>
</template>

<script setup lang="ts">
import AdminProfileTable from '@/components/admin/AdminProfileTable.vue'
import AdminProjectTable from '@/components/admin/AdminProjectTable.vue'
import type { ProfileWithPassword } from '@/components/admin/types'
import UISkeletonLoader from '@/components/ui/skeleton/UISkeletonLoader.vue'
import UIPageHeader from '@/components/ui/UIPageHeader.vue'
import UISection from '@/components/ui/UISection.vue'
import useDB from '@/composables/db'
import { useNotification } from '@/composables/notification'
import type { Profile, Project } from '@/db/types'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const db = useDB()
const { t } = useI18n()
const { errorToast, successToast, confirmDialog } = useNotification()

const profiles = ref<Profile[]>()
const projects = ref<Project[]>()

const loading = ref<boolean>(false)

onMounted(async () => {
  loading.value = true
  await Promise.all([loadProfiles(), loadProjects()])
  loading.value = false
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

async function loadProjects() {
  // TODO: Decide whether to load projects with owner data or connect them in frontend
  const { data, error } = await db.getProjects()

  if (error) {
    console.error(error)
    errorToast(t('notification.error.load'))
    projects.value = []
  } else {
    projects.value = data
  }
}

async function deleteProject(project: Project) {
  // Get user confirmation
  const confirmed = await confirmDialog({
    message: t('dialog.delete', { item: project.title }),
    confirm: t('action.delete'),
  })

  if (!confirmed) return

  // Delete project
  const { error } = await db.deleteProject(project.id)

  if (error) {
    console.error(error)
    errorToast(t('notification.error.delete'))
  } else {
    // Refresh project list
    await loadProjects()
    successToast(t('notification.success.delete'))
  }
}

// TODO: This is a duplicate of the copyProject function in HomeView.
async function copyProject(project: Project) {
  const { error } = await db.setProject({
    ...project,
    id: undefined, // Ensure a new ID is generated
    title: `${project.title} (${t('common.copy')})`,
  })

  if (error) {
    errorToast(t('notification.error.default'))
  } else {
    await loadProjects()
    successToast(t('notification.success.save'))
  }
}
</script>
