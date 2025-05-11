<template>
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
          <span>Neues Projekt</span>
        </div>
      </BaseCard>
    </button>
    <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
  </div>
</template>

<script setup lang="ts">
import BaseCard from '@/components/base/BaseCard.vue'
import ProjectCard from '@/components/project/ProjectCard.vue'
import useDB from '@/composables/db'
import type { Project } from '@/db/types'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MaterialSymbolsAdd from '~icons/material-symbols/add'

const router = useRouter()
const db = useDB()

const projects = ref<Project[] | null>(null)

onMounted(async () => {
  const { data } = await db.getProjects()
  projects.value = data
})

async function createProject() {
  const { data } = await db.setProject({
    title: 'Neues Projekt: ' + new Date(),
    street: 'Musterstraße',
    street_number: '1',
    zip_code: '12345',
    city: 'Musterstadt',
  })

  if (!data) return

  console.log(data)
  router.push({
    name: 'project',
    params: { projectId: data.id },
  })
}
</script>
