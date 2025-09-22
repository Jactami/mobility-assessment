<template>
  <UIErrorPage
    v-if="loadingError"
    :title="t('common.error')"
    :message="t('project.loadError')"
    @retry="loadProject"
  />

  <template v-else>
    <UISkeletonLoader :loading="projectLoading" height="3rem" width="40%" class="my-6">
      <UIPageHeader v-if="projectStore.project?.title" :title="projectStore.project.title" />
    </UISkeletonLoader>

    <div class="max-w-8xl mx-auto grid w-full grid-cols-1 gap-4 pb-20 xl:grid-cols-2">
      <!-- Search Bar -->
      <div class="col-span-full">
        <div class="mx-auto mb-3 w-full max-w-2xl">
          <UISkeletonLoader :loading="projectLoading" height="2.5rem">
            <MapSearchInput
              @search-initiated="geodataLoading = true"
              @search-completed="geodataLoading = false"
            />
          </UISkeletonLoader>
        </div>
      </div>

      <!-- Map -->
      <UIPanel ref="mapPanelRef" :title="t('project.map')" icon="map">
        <UISkeletonLoader :loading="isLoading" :height="`${mapHeight}px`">
          <MapPanel
            v-model="selectedPoi"
            :project="projectStore.project"
            :pois="projectStore.pois"
            :disabled="isLoading"
            :height="mapHeight"
          />
        </UISkeletonLoader>
      </UIPanel>

      <!-- Analytics -->
      <UIPanel :title="t('project.analytics')" icon="analytics">
        <div class="mx-auto max-w-xs">
          <UISkeletonLoader :loading="isLoading" height="10rem">
            <ProjectTotalScore :score="scores?.total" />
          </UISkeletonLoader>
        </div>
        <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 md:grid-cols-3">
          <template v-for="domain in DOMAINS" :key="domain.name">
            <UISkeletonLoader :loading="isLoading" height="2rem">
              <ProjectCategoryScores :domain="domain" :score="scores?.domain[domain.name]" />
            </UISkeletonLoader>
          </template>
        </div>
        <div class="mx-auto mt-3 h-auto w-full max-w-sm">
          <UISkeletonLoader :loading="isLoading" height="18rem">
            <ProjectScoreChart :scores="scores" />
          </UISkeletonLoader>
        </div>
      </UIPanel>

      <!-- POI table -->
      <UIPanel :title="t('project.poi', 2)" icon="poi" class="col-span-full">
        <div class="flex flex-wrap justify-center gap-2">
          <template v-for="domain in DOMAINS" :key="domain.name">
            <template v-for="(category, i) in domain.categories" :key="category.name">
              <UISkeletonLoader
                :loading="isLoading"
                height="1.5rem"
                :width="`${7 + (i % 3) * 2}rem`"
              >
                <ProjectCategoryPill
                  v-if="projectStore.project?.latitude && projectStore.project?.longitude"
                  :category="category.name"
                  :count="getPoisByCategory(projectStore.pois ?? [], category.name).length"
                />
              </UISkeletonLoader>
            </template>
          </template>
        </div>
        <div class="mt-12">
          <UISkeletonLoader :loading="isLoading" height="10rem">
            <ProjectPoiTable @poi-selected="handlePoiSelected" />
          </UISkeletonLoader>
        </div>
      </UIPanel>
    </div>

    <!-- Action Bar -->
    <UIMenuActionBar :items="actionItems" />

    <!-- Hidden content to produce map and chart exports -->
    <template v-if="!geodataLoading">
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
      <div class="hidden h-1">
        <ProjectScoreChart ref="chartRef" :scores="scores" />
      </div>
    </template>
  </template>
</template>

<script setup lang="ts">
import MapPanel from '@/components/map/MapPanel.vue'
import MapSearchInput from '@/components/map/MapSearchInput.vue'
import ProjectCategoryPill from '@/components/project/ProjectCategoryPill.vue'
import ProjectCategoryScores from '@/components/project/ProjectCategoryScores.vue'
import ProjectPoiTable from '@/components/project/ProjectPoiTable.vue'
import ProjectScoreChart from '@/components/project/ProjectScoreChart.vue'
import ProjectTotalScore from '@/components/project/ProjectTotalScore.vue'
import type { MenuListItem } from '@/components/ui/menu/types'
import UIMenuActionBar from '@/components/ui/menu/UIMenuActionBar.vue'
import UISkeletonLoader from '@/components/ui/skeleton/UISkeletonLoader.vue'
import UIErrorPage from '@/components/ui/UIErrorPage.vue'
import UIPageHeader from '@/components/ui/UIPageHeader.vue'
import UIPanel from '@/components/ui/UIPanel.vue'
import useDB from '@/composables/db'
import { useDownload } from '@/composables/download'
import { useEvaluation } from '@/composables/evaluation'
import type { EvaluationScores } from '@/composables/evaluation/types'
import { useLogger } from '@/composables/log'
import { useNotification } from '@/composables/notification'
import { usePDF } from '@/composables/pdf'
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
const { pdf, error, loading, createReport } = usePDF()
const { downloadPDF } = useDownload()
const { calcScores } = useEvaluation()
const { getPoisByDomain, getPoisByCategory } = useProjectUtil()

const mapHeight = 600 // px

// Original project and POIs from database to compare with store
const project = ref<Project | null>(null)
const pois = ref<Poi[] | null>(null)

const scores = ref<EvaluationScores | null>(null)

const selectedPoi = ref<Poi | null>(null)

const mapPanelRef = ref<InstanceType<typeof UIPanel> | null>(null)
const chartRef = ref<InstanceType<typeof ProjectScoreChart> | null>(null)
const mapRefs = useTemplateRef<InstanceType<typeof MapPanel>[] | null>('maps')

const loadingError = ref(false)

// Loading flags to indicate if data is being fetched
const geodataLoading = ref(false)
const projectLoading = ref(false)
const isLoading = computed(() => geodataLoading.value || projectLoading.value)

// Checks if the project has unsaved changes in a simple way
const isProjectDirty = computed(
  () =>
    JSON.stringify(projectStore.project) !== JSON.stringify(project.value) ||
    JSON.stringify(projectStore.pois) !== JSON.stringify(pois.value),
)

const actionItems: MenuListItem[] = [
  {
    label: t('project.overview'),
    icon: 'home',
    action: () => router.push('/'),
    divider: true,
  },
  {
    label: t('common.edit'),
    icon: 'edit',
    action: () => useLogger().log('TODO: EDIT'),
  },
  {
    label: t('project.report'),
    icon: 'report',
    action: generateReport,
  },
  {
    label: t('common.save'),
    icon: 'save',
    action: saveProject,
  },
]

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
  projectLoading.value = true

  // Fetch the project and POIs from the database
  const projectId = route.params.projectId as string
  const [projectResponse, poisResponse] = await Promise.all([
    db.getProject(projectId),
    db.getPois(projectId),
  ])

  projectLoading.value = false
  loadingError.value = false

  // If there is an error in the database, show error
  if (projectResponse.error || poisResponse.error) {
    errorToast(t('project.loadError'))
    loadingError.value = true
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

async function generateReport() {
  if (!projectStore.project || !projectStore.pois || !scores.value) {
    errorToast(t('common.errorMessage'))
    return
  }

  const toast = await loadingToast(t('project.generatingReport'))

  // Manually set loading state for PDF generation because we have to await image exports
  loading.value = true

  // Generate map images for each domain
  const maps: Record<string, string> = {}
  await Promise.all(
    mapRefs.value?.map(async (mapRef, i) => {
      const img = await mapRef.exportMap()
      if (img && DOMAINS[i]?.name) maps[DOMAINS[i].name] = img
    }) || [],
  )

  // Generate chart image
  const chart = (await chartRef.value?.exportChart()) || ''

  // Create the PDF report
  await createReport({
    project: projectStore.project,
    pois: projectStore.pois,
    scores: scores.value,
    chart,
    maps,
  })

  // If there is an error in creating the PDF, show error
  if (error.value) {
    console.error(error.value)
    errorToast(t('project.reportError'))
    return
  }

  if (pdf.value) {
    // Finally download the PDF
    downloadPDF(new Blob([new Uint8Array(pdf.value)]), `${projectStore.project.title}.pdf`)

    // Reset loading state
    toast.dismiss()
  }
}

// Handle POI selection from the table
function handlePoiSelected(poi: Poi) {
  selectedPoi.value = poi
  // scroll to the map section
  mapPanelRef.value?.$el.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
}

watch(
  () => projectStore.pois,
  () => {
    // Check if selectedPoi is still valid
    if (selectedPoi.value && !projectStore.pois?.some((poi) => poi.id === selectedPoi.value?.id)) {
      selectedPoi.value = null // Reset if not found
    }

    // Recalculate scores whenever POIs change
    if (
      projectStore.pois &&
      projectStore.project?.radius &&
      projectStore.project.latitude &&
      projectStore.project.longitude
    ) {
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
