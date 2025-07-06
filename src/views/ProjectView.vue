<template>
  <BaseSection>
    <MapSearchInput
      @search-initiated="geodataLoading = true"
      @search-completed="geodataLoading = false"
    />
    <MapPanel :disabled="geodataLoading" />

    <!-- Temporary save button -->
    <div class="mt-10 flex justify-center">
      <BaseButton :disabled="!isProjectDirty || geodataLoading" @click="saveProject">
        {{ t('common.save') }}
      </BaseButton>
    </div>
    <div class="mt-10 flex justify-center">
      <BaseButton :disabled="loading" @click="createReport">Report</BaseButton>
    </div>
  </BaseSection>

  <template v-if="!geodataLoading">
    <BaseSection v-if="projectStore.project?.score">
      <ProjectScore :score="projectStore.project?.score" />
    </BaseSection>

    <BaseSection v-if="projectStore.pois && projectStore.pois.length">
      <div class="flex flex-wrap justify-center gap-2">
        <template v-for="domain in DOMAINS" :key="domain.name">
          <ProjectCategoryPill
            v-for="category in domain.categories"
            :key="category.name"
            :category="category.name"
            :count="projectStore.pois.filter((poi) => poi.category === category.name).length"
          />
        </template>
      </div>
    </BaseSection>

    <BaseSection>
      <ProjectPoiTable />
    </BaseSection>

    <DebugPanel title="Project Store" :value="projectStore.project" />

    <DebugPanel title="Project Scores" :value="scores" />
  </template>
</template>

<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import BaseSection from '@/components/base/BaseSection.vue'
import DebugPanel from '@/components/debug/DebugPanel.vue'
import MapPanel from '@/components/map/MapPanel.vue'
import MapSearchInput from '@/components/map/MapSearchInput.vue'
import ProjectCategoryPill from '@/components/project/ProjectCategoryPill.vue'
import ProjectPoiTable from '@/components/project/ProjectPoiTable.vue'
import ProjectScore from '@/components/project/ProjectScore.vue'
import useDB from '@/composables/db'
import { useEvaluation } from '@/composables/evaluation'
import type { EvaluationScores } from '@/composables/evaluation/types'
import { useNotification } from '@/composables/notification'
import { usePdf } from '@/composables/pdf'
import { DOMAINS } from '@/constants'
import type { Poi, Project } from '@/db/types'
import { useProjectStore } from '@/stores/Project'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'

const { t } = useI18n()
const db = useDB()
const projectStore = useProjectStore()
const route = useRoute()
const router = useRouter()
const { errorToast, successToast, confirmDialog } = useNotification()
const { pdf, loading, error, createPdf } = usePdf()
const { calcScores } = useEvaluation()

const project = ref<Project | null>(null)
const pois = ref<Poi[] | null>(null)
const scores = ref<EvaluationScores | null>(null)

// a loading flag to indicate if geodata is being fetched
const geodataLoading = ref(false)

// Checks if the project has unsaved changes in a simple way
const isProjectDirty = computed(
  () =>
    JSON.stringify(projectStore.project) !== JSON.stringify(project.value) ||
    JSON.stringify(projectStore.pois) !== JSON.stringify(pois.value),
)

// Load the project and POIs when the user enters the page
onMounted(loadProject)

// Reset the project state when user leaves the page
onUnmounted(projectStore.reset)

// Prompt user if they try to leave the page with unsaved changes
onBeforeRouteLeave(async (_, __, next) => {
  if (isProjectDirty.value) {
    const confirmLeave = await confirmDialog(t('project.confirmLeave'))
    if (confirmLeave) {
      return next()
    }
    return next(false)
  }

  return next()
})

async function loadProject() {
  // Fetch the project and POIs from the database
  const projectId = route.params.projectId as string
  const [projectResponse, poisResponse] = await Promise.all([
    db.getProject(projectId),
    db.getPois(projectId),
  ])

  // If there is an error in the database, show error
  if (projectResponse.error || poisResponse.error) {
    errorToast(t('project.loadError'))
    return
  }

  // If no project or POIs are found, show error message
  if (!projectResponse.data || !poisResponse.data) {
    errorToast(t('project.notFound'))
    projectStore.reset()
    project.value = null
    pois.value = null
    router.push('/')
    return
  }

  // Set the project and POIs in the store
  project.value = projectResponse.data
  pois.value = poisResponse.data
  projectStore.set(project.value, pois.value)
}

async function saveProject() {
  if (!projectStore.project || !projectStore.pois) return

  // Save the project and POIs to the database
  const [projectResponse, poisResponse] = await Promise.all([
    db.setProject(projectStore.project),
    db.setPois(projectStore.pois),
  ])

  // If there is an error in the database, show error
  if (projectResponse.error || poisResponse.error) {
    errorToast(t('project.saveError'))
    return
  }

  // If no project or POIs are found, show error message
  if (!projectResponse.data || !poisResponse.data) {
    errorToast(t('project.loadError'))
    return
  }

  // Show success message
  successToast(t('project.saveSuccess'))

  // Update the project and POIs in the store
  project.value = projectResponse.data
  pois.value = poisResponse.data
  projectStore.set(project.value, pois.value)
}

async function createReport() {
  // Create the PDF report
  await createPdf({
    project: projectStore.project,
    pois: projectStore.pois,
  })

  // If there is an error in creating the PDF, show error
  if (error.value) {
    console.error(error.value)
    errorToast('TODO: error creating PDF')
    return
  }

  // If the PDF is created successfully, open it in a new tab
  if (pdf.value) {
    window.open(URL.createObjectURL(pdf.value))
  }
}

watch(
  () => projectStore.pois,
  () => {
    if (projectStore.pois && projectStore.project?.radius) {
      scores.value = calcScores(projectStore.pois, projectStore.project.radius)
      projectStore.updateProject({
        ...projectStore.project,
        score: scores.value.total,
      })
    }
  },
  { immediate: true, deep: true },
)
</script>
