<template>
  <!-- Action Bar -->
  <div class="max-w-sm">
    <FormKit
      v-model="searchQuery"
      type="text"
      name="search"
      :label="t('common.search')"
      :placeholder="t('common.searchPlaceholder')"
      autocomplete="off"
      :spellcheck="false"
      label-class="sr-only"
    >
      <template #prefixIcon>
        <IconRenderer icon="search" class="mr-2 text-on-surface-variant" />
      </template>
      <template #suffixIcon>
        <div class="absolute inset-y-0 right-0 flex items-center pr-2">
          <IconButton v-if="searchQuery" icon="clear" @click="searchQuery = ''" />
        </div>
      </template>
    </FormKit>
  </div>

  <!-- Favorites -->
  <BaseSection v-if="favoriteProjects && favoriteProjects.length" :title="t('project.favorites')">
    <div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
      <ProjectCard
        v-for="project in favoriteProjects"
        :key="project.id"
        :project="project"
        @delete="deleteProject(project)"
        @copy="copyProject(project)"
        @favorite="toggleFavorite(project)"
      />
    </div>
  </BaseSection>

  <!-- All Projects -->
  <BaseSection :title="t('project.myProjects')">
    <div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
      <template v-if="!loading">
        <button class="cursor-pointer" title="Neues Projekt" @click="createProject">
          <BaseCard :animation="true" class="min-h-64">
            <div
              class="flex h-full flex-col items-center justify-center gap-y-4 bg-surface-container p-2"
            >
              <IconRenderer
                class="rounded-full bg-surface text-7xl text-on-surface-variant"
                icon="add"
              />
              <span>{{ t('project.create') }}</span>
            </div>
          </BaseCard>
        </button>
        <ProjectCard
          v-for="project in filteredProjects"
          :key="project.id"
          :project="project"
          @delete="deleteProject(project)"
          @copy="copyProject(project)"
          @favorite="toggleFavorite(project)"
        />
      </template>
      <template v-else>
        <BaseCard v-for="i in 4" :key="i" :animation="false" class="min-h-64">
          <BaseSkeleton width="100%" height="100%" />
        </BaseCard>
      </template>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import BaseCard from '@/components/base/BaseCard.vue'
import BaseSection from '@/components/base/BaseSection.vue'
import BaseSkeleton from '@/components/base/BaseSkeleton.vue'
import IconButton from '@/components/icon/IconButton.vue'
import IconRenderer from '@/components/icon/IconRenderer.vue'
import ProjectCard from '@/components/project/ProjectCard.vue'
import useDB from '@/composables/db'
import { useNotification } from '@/composables/notification'
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

const searchQuery = ref('')

const loading = ref(false)
const projects = ref<Project[] | null>(null)

/** Filter projects based on the search query. */
const filteredProjects = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  // TODO: Decide whether to filter by more fields or even allow composite queries (e.g. full address)
  return projects.value?.filter(
    (project) =>
      project.title.toLowerCase().includes(query) ||
      project.city?.toLowerCase().includes(query) ||
      project.street?.toLowerCase().includes(query),
  )
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

  if (error) {
    errorToast(t('project.loadAllError'))
    return
  }

  projects.value = data
}

async function createProject() {
  if (!authStore.user) return

  const { data, error } = await db.setProject({
    title: 'Neues Projekt',
    owner_id: authStore.user.id,
  })

  if (!data || error) {
    // Check if the error is due to project limit
    // TODO
    if (error?.code === 'P0001') {
      errorToast(t('project.limitReached'))
    } else {
      // General error handling
      errorToast(t('project.createError'))
    }
  } else {
    router.push({
      name: 'project',
      params: { projectId: data.id },
    })

    successToast(t('project.createSuccess'))
  }
}

async function deleteProject(project: Project) {
  if (!authStore.user) return

  const confirmLeave = await confirmDialog(t('project.confirmDelete'))
  if (!confirmLeave) return

  const { error } = await db.deleteProject(project.id)

  if (error) {
    errorToast(t('project.deleteError'))
  } else {
    successToast(t('project.deleteSuccess'))
    loadProjects()
  }
}

async function copyProject(project: Project) {
  if (!authStore.user) return

  const { data, error } = await db.setProject({
    ...project,
    id: undefined, // Ensure a new ID is generated
    title: `${project.title} (${t('project.projectCopy')})`,
  })

  if (!data || error) {
    errorToast(t('project.createError'))
  } else {
    router.push({
      name: 'project',
      params: { projectId: data.id },
    })

    successToast(t('project.createSuccess'))
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
