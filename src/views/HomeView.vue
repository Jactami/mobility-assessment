<template>
  <UIPageHeader :title="t('navigation.home')" />

  <UIErrorPage
    v-if="loadingError"
    :title="t('common.error')"
    :message="t('notification.error.load')"
    @retry="loadProjects"
  />

  <template v-else>
    <!-- User Status -->
    <AuthUserStatusAlert />

    <template v-if="!authStore.isBlocked">
      <!-- Action Bar -->
      <div class="mt-5 max-w-sm">
        <FormKit
          id="project-filter-input"
          v-model="filter"
          type="text"
          name="filter"
          :label="t('common.search')"
          label-class="sr-only"
          :placeholder="t('common.search')"
          autocomplete="off"
          :spellcheck="false"
        >
          <template #prefixIcon>
            <UIIcon icon="search" class="mr-2 text-on-surface-variant" />
          </template>
          <template #suffixIcon>
            <div class="absolute right-0 bottom-1 flex items-center pr-2">
              <UIButtonIcon
                v-if="filter"
                icon="clear"
                :aria-label="t('common.clear')"
                @click="clearFilter"
              />
            </div>
          </template>
        </FormKit>
      </div>

      <!-- Favorites -->
      <UISection
        v-if="favoriteProjects && favoriteProjects.length"
        :title="t('project.favorite.label', 2)"
      >
        <div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <ProjectCard
            v-for="project in favoriteProjects"
            :key="project.id"
            :project="project"
            :filter="filter"
            @delete="deleteProject(project)"
            @duplicate="duplicateProject(project)"
            @favorite="toggleFavorite(project)"
          />
        </div>
      </UISection>

      <!-- All Projects -->
      <UISection :title="t('project.allProjects')">
        <div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <template v-if="!loading">
            <button
              class="cursor-pointer"
              :title="t('action.createItem', { item: t('project.label') })"
              @click="createProject"
            >
              <UICard :animation="true" class="min-h-64">
                <div
                  class="flex h-full flex-col items-center justify-center gap-y-4 p-2 text-on-surface-variant"
                >
                  <UIIcon class="rounded-full text-7xl text-on-surface-variant" icon="add" />
                  <span>{{ t('action.createItem', { item: t('project.label') }) }}</span>
                </div>
              </UICard>
            </button>
            <ProjectCard
              v-for="project in filteredProjects"
              :key="project.id"
              :project="project"
              :filter="filter"
              @delete="deleteProject(project)"
              @duplicate="duplicateProject(project)"
              @favorite="toggleFavorite(project)"
            />
          </template>
          <template v-else>
            <UICard v-for="i in 4" :key="i" :animation="false" class="min-h-64">
              <UISkeleton width="100%" height="100%" />
            </UICard>
          </template>
        </div>
      </UISection>
    </template>
  </template>
</template>

<script setup lang="ts">
import AuthUserStatusAlert from '@/components/auth/AuthUserStatusAlert.vue'
import ProjectCard from '@/components/project/ProjectCard.vue'
import UIButtonIcon from '@/components/ui/button/UIButtonIcon.vue'
import UIIcon from '@/components/ui/icon/UIIcon.vue'
import UISkeleton from '@/components/ui/skeleton/UISkeleton.vue'
import UICard from '@/components/ui/UICard.vue'
import UIErrorPage from '@/components/ui/UIErrorPage.vue'
import UIPageHeader from '@/components/ui/UIPageHeader.vue'
import UISection from '@/components/ui/UISection.vue'
import useDB from '@/composables/db'
import { useNotification } from '@/composables/notification'
import { useUtil } from '@/composables/util/misc'
import type { Project } from '@/db/types'
import { useAuthStore } from '@/stores/Auth'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const router = useRouter()
const db = useDB()
const authStore = useAuthStore()
const { successToast, errorToast, confirmDialog } = useNotification()
const { t } = useI18n()
const { createAddress } = useUtil()

const filter = ref('')

const loading = ref(false)
const loadingError = ref<boolean>(false)
const projects = ref<Project[] | null>(null)

/** Filtered projects based on the filter query. */
const filteredProjects = computed(() => {
  return projects.value?.filter((project) => {
    // Create address
    const address = createAddress(project)

    // Check if filter query is in title or address
    return (
      project.title.toLowerCase().includes(filter.value) ||
      address.toLowerCase().includes(filter.value)
    )
  })
})

/** Projects marked as favorites within the filtered projects. */
const favoriteProjects = computed(() => {
  return filteredProjects.value?.filter((project) => project.favorite)
})

onMounted(async () => {
  loading.value = true
  await loadProjects()
  loading.value = false
})

async function loadProjects() {
  const { data, error } = await db.getProjects()
  loadingError.value = false

  if (error) {
    errorToast(t('notification.error.load'))
    loadingError.value = true
  }

  projects.value = data
}

async function createProject() {
  if (!authStore.user) return

  const { data, error } = await db.setProject({
    title: t('project.newProject'),
    owner_id: authStore.user.id,
  })

  if (!data || error) {
    // Check if the error is due to project limit
    if (error?.code === 'P0001') {
      errorToast(t('project.error.limitExceeded'))
    } else {
      // General error handling
      errorToast(t('notification.error.default'))
    }
  } else {
    router.push({
      name: 'project',
      params: { projectId: data.id },
    })
  }
}

async function deleteProject(project: Project) {
  if (!authStore.user) return

  const confirmLeave = await confirmDialog({
    message: t('dialog.delete', { item: project.title }),
    confirm: t('action.delete'),
  })
  if (!confirmLeave) return

  // Delete project and associated pois
  const [projectResp, poisResp] = await Promise.all([
    db.deleteProject(project.id),
    db.deletePois(project.id),
  ])

  if (projectResp.error || poisResp.error) {
    errorToast(t('notification.error.delete'))
  } else {
    successToast(t('notification.success.delete'))
    // Load updated project list in the background
    loadProjects()
  }
}

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

  // Navigate to the new project
  router.push({
    name: 'project',
    params: { projectId: newProject.id },
  })
}

function clearFilter() {
  filter.value = ''

  const input = document.getElementById('project-filter-input') as HTMLInputElement
  if (input) {
    input.focus()
    input.select()
  }
}

async function toggleFavorite(project: Project) {
  if (!authStore.user) return

  await db.setProject({
    ...project,
    favorite: !project.favorite, // Toggle favorite status
  })

  loadProjects()
}
</script>
