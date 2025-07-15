<template>
  <BaseSection>
    <div ref="mapSection" class="scroll-mt-4">
      <MapSearchInput
        @search-initiated="geodataLoading = true"
        @search-completed="geodataLoading = false"
      />
      <MapPanel
        v-model="selectedPoi"
        :project="projectStore.project"
        :pois="projectStore.pois"
        :disabled="geodataLoading"
      />
    </div>
    <!-- Temporary save button -->
    <div class="mt-10 flex justify-center">
      <BaseButton :disabled="!isProjectDirty || geodataLoading" @click="saveProject">
        {{ t('common.save') }}
      </BaseButton>
    </div>
    <div class="mt-10 flex justify-center">
      <BaseButton :disabled="pdfLoading" @click="createReport">Report</BaseButton>
    </div>
  </BaseSection>

  <template v-if="!geodataLoading">
    <BaseSection v-if="projectStore.project?.score">
      <ProjectScore :score="projectStore.project?.score" />
    </BaseSection>

    <BaseSection v-if="scores">
      <div class="mx-auto max-w-xl">
        <ProjectScoreChart ref="chartRef" :scores="scores" />
      </div>
    </BaseSection>

    <BaseSection v-if="projectStore.pois && projectStore.pois.length">
      <div class="flex flex-wrap justify-center gap-2">
        <template v-for="domain in DOMAINS" :key="domain.name">
          <ProjectCategoryPill
            v-for="category in domain.categories"
            :key="category.name"
            :category="category.name"
            :count="getPoisByCategory(projectStore.pois, category.name).length"
          />
        </template>
      </div>
    </BaseSection>

    <BaseSection>
      <ProjectPoiTable @poi-selected="handlePoiSelected" />
    </BaseSection>

    <DebugPanel title="Project Store" :value="projectStore.project" />

    <!-- Hidden Maps to produce map image exports -->
    <div class="invisible">
      <MapPanel
        v-for="domain in DOMAINS"
        :key="domain.name"
        ref="maps"
        :project="project"
        :pois="getPoisByDomain(projectStore.pois || [], domain.name)"
        :height="1"
      />
    </div>
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
import ProjectScoreChart from '@/components/project/ProjectScoreChart.vue'
import useDB from '@/composables/db'
import { useEvaluation } from '@/composables/evaluation'
import type { EvaluationScores } from '@/composables/evaluation/types'
import { useNotification } from '@/composables/notification'
import { usePdf } from '@/composables/pdf'
import { useProjectUtil } from '@/composables/util/project'
import { DOMAINS } from '@/constants'
import type { Poi, Project } from '@/db/types'
import { useProjectStore } from '@/stores/Project'
import { computed, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'

const { t } = useI18n()
const db = useDB()
const projectStore = useProjectStore()
const route = useRoute()
const router = useRouter()
const { errorToast, loadingToast, successToast, confirmDialog } = useNotification()
const { pdf, error, createPdf } = usePdf()
const { calcScores } = useEvaluation()
const { getPoisByDomain, getPoisByCategory } = useProjectUtil()

// Original project and POIs from database to compare with store
const project = ref<Project | null>(null)
const pois = ref<Poi[] | null>(null)

const scores = ref<EvaluationScores | null>(null)

const selectedPoi = ref<Poi | null>(null)

const mapSection = ref<HTMLDivElement | null>(null)
const chartRef = ref<InstanceType<typeof ProjectScoreChart> | null>(null)
const mapRefs = useTemplateRef<InstanceType<typeof MapPanel>[] | null>('maps')

// Loading flag to indicate if geodata is being fetched
const geodataLoading = ref(false)

// Loading flag to indicate if the pdf is being generated
const pdfLoading = ref(false)

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
  if (!projectStore.project || !projectStore.pois || !scores.value) {
    errorToast(t('common.errorMessage'))
    return
  }

  const toast = await loadingToast(t('project.generatingReport'))

  // Set loading state for PDF generation
  pdfLoading.value = true

  // Generate map images for each domain
  const maps: Record<string, string> = {}
  await Promise.all(
    mapRefs.value?.map(async (mapRef, i) => {
      const img = await mapRef.exportMap()
      if (img) maps[DOMAINS[i].name] = img
    }) || [],
  )

  // Generate chart image
  const chart = (await chartRef.value?.exportChart()) || ''

  // Create the PDF report
  await createPdf({
    project: projectStore.project,
    pois: projectStore.pois,
    scores: scores.value,
    chart,
    maps,
  })

  // If there is an error in creating the PDF, show error
  if (error.value) {
    console.error(error.value)
    errorToast('TODO: error creating PDF')
    return
  }

  if (pdf.value) {
    const blob = new Blob([pdf.value], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)

    // Uncomment the following line to open the PDF in a new tab
    // window.open(url)

    // Download the PDF
    const link = document.createElement('a')
    link.href = url
    link.download = `${projectStore.project.title}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Revoke the object URL to free up memory
    URL.revokeObjectURL(url)

    // Reset loading state
    pdfLoading.value = false
    await toast.dismiss()
  }
}

// Handle POI selection from the table
function handlePoiSelected(poi: Poi) {
  selectedPoi.value = poi
  // scroll to the map section
  mapSection.value?.scrollIntoView({ behavior: 'smooth' })
}

watch(
  () => projectStore.pois,
  () => {
    // Check if selectedPoi is still valid
    if (selectedPoi.value && !projectStore.pois?.some((poi) => poi.id === selectedPoi.value?.id)) {
      selectedPoi.value = null // Reset if not found
    }

    // Recalculate scores whenever POIs change
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
