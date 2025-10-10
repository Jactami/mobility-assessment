<template>
  <UIPageHeader :title="t('navigation.home')" />

  <UIErrorPage
    v-if="loadingError"
    :title="t('common.error')"
    :message="t('notification.error.load')"
    @retry="loadProjects"
  />

  <template v-else>
    <!-- Action Bar -->
    <div class="mt-3 max-w-sm">
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
          <UIIcon icon="search" class="text-on-surface-variant mr-2" />
        </template>
        <template #suffixIcon>
          <div class="absolute bottom-1 right-0 flex items-center pr-2">
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
          @copy="copyProject(project)"
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
                class="text-on-surface-variant flex h-full flex-col items-center justify-center gap-y-4 p-2"
              >
                <UIIcon class="text-on-surface-variant rounded-full text-7xl" icon="add" />
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
            @copy="copyProject(project)"
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

<script setup lang="ts">
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

onMounted(() => {
  // Load projects when user enters the page
  loading.value = true
  loadProjects()
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
    // TODO
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

  const { error } = await db.deleteProject(project.id)

  if (error) {
    errorToast(t('notification.error.delete'))
  } else {
    successToast(t('notification.success.delete'))
    loadProjects()
  }
}

async function copyProject(project: Project) {
  if (!authStore.user) return

  const { data, error } = await db.setProject({
    ...project,
    id: undefined, // Ensure a new ID is generated
    title: `${project.title} (${t('common.copy')})`,
  })

  if (!data || error) {
    errorToast(t('notification.error.default'))
  } else {
    router.push({
      name: 'project',
      params: { projectId: data.id },
    })
  }
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
