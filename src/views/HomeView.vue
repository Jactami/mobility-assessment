<template>
  <h1>Home</h1>

  <DebugPanel title="Supabase Project" :value="projects" />
  <BaseButton classes="mt-4 mx-auto" @click="upsertProject">Update</BaseButton>
</template>

<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import DebugPanel from '@/components/debug/DebugPanel.vue'
import useDB from '@/composables/db'
import type { Project } from '@/db/types'
import { onMounted, ref } from 'vue'

const db = useDB()

const projects = ref<Project[] | null>(null)

onMounted(async () => {
  const { data } = await db.getProjects()
  projects.value = data
})

async function upsertProject() {
  if (!projects.value || projects.value.length <= 0) return

  const { data } = await db.setProject({ ...projects.value[0], title: 'Updated: ' + Date.now() })
  projects.value = data
}
</script>
