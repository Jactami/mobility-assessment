<template>
  <BaseSection>
    <MapSearchInput />
    <MapPanel />
    <!-- Temporary save button -->
    <div class="mt-10 flex justify-center">
      <BaseButton @click="saveProject">{{ t('common.save') }}</BaseButton>
    </div>
  </BaseSection>
  <DebugPanel title="Project Store" :value="projectStore.project" />
</template>

<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import BaseSection from '@/components/base/BaseSection.vue'
import DebugPanel from '@/components/debug/DebugPanel.vue'
import MapPanel from '@/components/map/MapPanel.vue'
import MapSearchInput from '@/components/map/MapSearchInput.vue'
import useDB from '@/composables/db'
import { useNotification } from '@/composables/notification'
import { useProjectStore } from '@/stores/Project'
import { onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const db = useDB()
const projectStore = useProjectStore()
const route = useRoute()
const { errorToast, successToast } = useNotification()

onMounted(async () => {
  const { data } = await db.getProject(route.params.projectId as string)
  if (data) projectStore.set(data)
})

onUnmounted(() => {
  projectStore.reset()
})

async function saveProject() {
  if (!projectStore.project) return

  try {
    const { data, error } = await db.setProject(projectStore.project)
    if (data) projectStore.set(data)
    if (error) throw error
    successToast(t('project.saveSuccess'))
  } catch (error) {
    console.error(error)
    errorToast(t('project.saveError'))
  }
}
</script>
