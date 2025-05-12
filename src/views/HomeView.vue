<template>
  <BaseSection :title="t('project.project', 2)">
    <div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
      <button class="cursor-pointer" title="Neues Projekt" @click="createProject">
        <BaseCard>
          <div
            class="flex h-full flex-col items-center justify-center gap-y-4 bg-surface-container p-2"
          >
            <div
              class="flex aspect-square w-1/2 items-center justify-center rounded-full border border-outline-variant bg-surface"
            >
              <MaterialSymbolsAdd class="text-2xl text-on-surface-variant" aria-hidden="true" />
            </div>
            <span>{{ t('project.create') }}</span>
          </div>
        </BaseCard>
      </button>
      <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import BaseCard from '@/components/base/BaseCard.vue'
import BaseSection from '@/components/base/BaseSection.vue'
import ProjectCard from '@/components/project/ProjectCard.vue'
import useDB from '@/composables/db'
import { useNotification } from '@/composables/notification'
import type { Project } from '@/db/types'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import MaterialSymbolsAdd from '~icons/material-symbols/add'

const router = useRouter()
const db = useDB()
const notification = useNotification()
const { t } = useI18n()

const projects = ref<Project[] | null>(null)

onMounted(async () => {
  const { data } = await db.getProjects()
  projects.value = data
})

async function createProject() {
  const { data, error } = await db.setProject({
    title: 'Neues Projekt: ' + new Date(),
    street: 'Musterstraße',
    street_number: '1',
    zip_code: '12345',
    city: 'Musterstadt',
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
