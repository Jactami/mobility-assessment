<template>
  <BaseSection :title="t('project.project', 2)">
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
          v-for="project in projects"
          :key="project.id"
          :project="project"
          @delete="deleteProject(project)"
          @copy="copyProject(project)"
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
import IconRenderer from '@/components/icon/IconRenderer.vue'
import ProjectCard from '@/components/project/ProjectCard.vue'
import useDB from '@/composables/db'
import { useNotification } from '@/composables/notification'
import type { Project } from '@/db/types'
import { useAuthStore } from '@/stores/Auth'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const router = useRouter()
const db = useDB()
const authStore = useAuthStore()
const { successToast, errorToast, confirmDialog } = useNotification()
const { t } = useI18n()

const loading = ref(false)
const projects = ref<Project[] | null>(null)

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
    errorToast(t('project.createError'))
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
    title: `${project.title} (Kopie)`,
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
</script>
