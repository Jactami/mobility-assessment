<template>
  <h1>Home</h1>

  <DebugPanel title="Supabae Project" :value="projects" />
</template>

<script setup lang="ts">
import DebugPanel from '@/components/debug/DebugPanel.vue'
import { supabase } from '@/db'
import { onMounted, ref } from 'vue'

const projects = ref()

onMounted(async () => {
  const { data } = await supabase.from('projects').select()
  projects.value = data
})
</script>
