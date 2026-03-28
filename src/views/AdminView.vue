<template>
  <UIPageHeader :title="t('navigation.admin')" />

  <!-- TODO: Decide whether to split user and project management into separate views or keep them together. -->

  <div class="max-w-8xl mx-auto grid w-full grid-cols-1 gap-4">
    <UIPanel :title="t('user.label', 2)" icon="user" :actions="userActions">
      <UISkeletonLoader :loading="loading" height="10rem">
        <AdminProfileTable
          v-if="profiles"
          :profiles="profiles"
          @add="upsertUser"
          @update="upsertUser"
          @delete="deleteUser"
        />
      </UISkeletonLoader>
    </UIPanel>

    <UIPanel :title="t('project.label', 2)" icon="project" :actions="projectActions">
      <UISkeletonLoader :loading="loading" height="10rem">
        <AdminProjectTable
          v-if="projects && profiles"
          :projects="projects"
          :profiles="profiles"
          @add="upsertProject"
          @update="upsertProject"
          @duplicate="duplicateProject"
          @delete="deleteProject"
        />
      </UISkeletonLoader>
    </UIPanel>
  </div>
</template>

<script setup lang="ts">
import AdminProfileTable from '@/components/admin/AdminProfileTable.vue'
import AdminProjectTable from '@/components/admin/AdminProjectTable.vue'
import type { ProfileWithPassword } from '@/components/admin/types'
import type { MenuListItem } from '@/components/ui/menu/types'
import UISkeletonLoader from '@/components/ui/skeleton/UISkeletonLoader.vue'
import UIPageHeader from '@/components/ui/UIPageHeader.vue'
import UIPanel from '@/components/ui/UIPanel.vue'
import useDB from '@/composables/db'
import { useNotification } from '@/composables/notification'
import type { Profile, Project } from '@/db/types'
import { useAuthStore } from '@/stores/Auth'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const db = useDB()
const { t } = useI18n()
const { errorToast, successToast, confirmDialog } = useNotification()
const router = useRouter()
const authStore = useAuthStore()

const profiles = ref<Profile[]>()
const projects = ref<Project[]>()

const loading = ref<boolean>(false)

const userActions: MenuListItem[] = [
  {
    label: t('action.refresh'),
    icon: 'refresh',
    action: loadProfiles,
  },
]

const projectActions: MenuListItem[] = [
  {
    label: t('action.refresh'),
    icon: 'refresh',
    action: loadProjects,
  },
]

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
  const { error } = await db.deleteUser(profile.id)

  if (error) {
    console.error(error)
    errorToast(t('notification.error.delete'))
  } else {
    successToast(t('notification.success.delete'))
    // Load updated profile list in the background
    loadProfiles()
  }
}

async function upsertUser(profile: ProfileWithPassword) {
  const { error } = await db.setUser({
    id: profile.id,
    firstName: profile.first_name || '',
    lastName: profile.last_name || '',
    email: profile.email || '',
    isDisabled: profile.is_disabled,
    expiresAt: profile.expires_at ? new Date(profile.expires_at) : undefined,
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
    successToast(t('notification.success.save'))
    // Load updated profile list in the background
    loadProfiles()
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

async function upsertProject(project?: Project) {
  if (!authStore.user) return

  const { data, error } = await db.setProject({
    // Set default values for new project
    title: t('project.newProject'),
    owner_id: authStore.user.id,
    // Overwrite default values with provided project data
    ...project,
  })

  if (!data || error) {
    // Check if the error is due to project limit
    if (error?.code === 'P0001') {
      errorToast(t('project.error.limitExceeded'))
    } else {
      // General error handling
      errorToast(t('notification.error.default'))
    }
  } else if (!project) {
    // Navigate to project if it was a creation, not an update
    router.push({
      name: 'project',
      params: { projectId: data.id },
    })
  } else {
    // Show success message for updates and reload project list
    successToast(t('notification.success.save'))
    loadProjects()
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
    successToast(t('notification.success.delete'))
    // Load updated project list in the background
    loadProjects()
  }
}

// TODO: This is a duplicate of the duplicateProject function in HomeView.
async function duplicateProject(project: Project) {
  // Clone project
  const projectResp = await db.setProject({
    ...project,
    id: undefined, // Ensure a new ID is generated
    title: `${project.title} (${t('common.copy')})`,
  })

  if (projectResp.error || !projectResp.data) {
    errorToast(t('notification.error.default'))
    return
  }

  const newProject = projectResp.data

  // Load pois
  const poisResp = await db.getPois(project.id)
  if (poisResp.error) {
    errorToast(t('notification.error.default'))
    return
  }

  // Clone pois
  const newPois = (poisResp.data || []).map((poi) => ({
    ...poi,
    id: undefined, // Ensure a new ID is generated
    project_id: newProject.id, // Link to new project
  }))

  // Save new pois
  if (newPois.length > 0) {
    const newPoisResp = await db.setPois(newPois)
    if (newPoisResp.error) {
      errorToast(t('notification.error.default'))
      return
    }
  }

  successToast(t('notification.success.save'))

  // Load updated project list in the background
  loadProjects()
}
</script>
