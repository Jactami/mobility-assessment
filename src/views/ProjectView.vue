<template>
  <DebugPanel title="Project Data" :value="project" />
</template>

<script setup lang="ts">
import DebugPanel from '@/components/debug/DebugPanel.vue'
import useDB from '@/composables/db'
import type { Project } from '@/db/types'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const db = useDB()
const route = useRoute()

const project = ref<Project | null>(null)

onMounted(async () => {
  const { data } = await db.getProject(route.params.projectId as string)
  project.value = data
})
</script>
