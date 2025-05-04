<template>
  <div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
    <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
  </div>
</template>

<script setup lang="ts">
import ProjectCard from '@/components/project/ProjectCard.vue'
import useDB from '@/composables/db'
import type { Project } from '@/db/types'
import { onMounted, ref } from 'vue'

const db = useDB()

const projects = ref<Project[] | null>(null)

onMounted(async () => {
  const { data } = await db.getProjects()
  projects.value = data
})
</script>
