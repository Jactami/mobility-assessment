<template>
  <BaseSection>
    <MapSearchInput></MapSearchInput>
    <MapPanel></MapPanel>
  </BaseSection>
  <DebugPanel title="Project Store" :value="project" />
</template>

<script setup lang="ts">
import BaseSection from '@/components/base/BaseSection.vue'
import DebugPanel from '@/components/debug/DebugPanel.vue'
import MapPanel from '@/components/map/MapPanel.vue'
import MapSearchInput from '@/components/map/MapSearchInput.vue'
import useDB from '@/composables/db'
import { useProjectStore } from '@/stores/Project'
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const db = useDB()
const projectStore = useProjectStore()
const route = useRoute()

const project = computed(() => projectStore.project)

onMounted(async () => {
  const { data } = await db.getProject(route.params.projectId as string)
  projectStore.update(data)
})

onUnmounted(() => {
  projectStore.reset()
})
</script>
