<template>
  <BaseSection :title="t('project.project', 2)">
    <div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
      <template v-if="!loading">
        <button class="cursor-pointer" title="Neues Projekt" @click="createProject">
          <BaseCard :animation="true">
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
        <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
      </template>
      <template v-else>
        <BaseCard v-for="i in 4" :key="i" :animation="false" class="h-64">
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
const notification = useNotification()
const { t } = useI18n()

const loading = ref(false)
const projects = ref<Project[] | null>(null)

onMounted(loadProjects)

async function loadProjects() {
  try {
    loading.value = true
    const { data, error } = await db.getProjects()
    if (error) throw error

    projects.value = data
  } catch {
    notification.errorToast(t('project.loadAllError'))
  } finally {
    loading.value = false
  }
}

async function createProject() {
  if (!authStore.user) return

  const { data, error } = await db.setProject({
    title: 'Neues Projekt: ' + new Date(),
    owner_id: authStore.user.id,
  })

  if (!data || error) {
    notification.errorToast(t('project.createError'))
  } else {
    router.push({
      name: 'project',
      params: { projectId: data.id },
    })

    notification.successToast(t('project.createSuccess'))
  }
}
</script>
