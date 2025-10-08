<template>
  <UIErrorPage
    v-if="projectError"
    :title="t('common.error')"
    :message="t('notification.error.load')"
    @retry="loadProject"
  />

  <template v-else>
    <UISkeletonLoader :loading="projectLoading" height="3rem" width="30%" class="my-6">
      <UIPageHeader v-if="projectStore.project?.title" :title="projectStore.project.title" />
    </UISkeletonLoader>

    <!-- Search Bar -->
    <div class="mx-auto mt-2 w-full lg:max-w-2xl">
      <UISkeletonLoader :loading="projectLoading" height="2.5rem">
        <ProjectSearchBar
          v-if="projectStore.project"
          :project="projectStore.project"
          :loading="isFetching"
          @search="search"
        />
      </UISkeletonLoader>
    </div>

    <!-- Dashboard Panels -->
    <div class="max-w-8xl mx-auto mt-8 grid w-full grid-cols-1 gap-4 pb-20 xl:grid-cols-2">
      <!-- Map -->
      <ProjectMapPanel
        id="map-panel"
        :project="projectStore.project"
        :pois="projectStore.pois"
        :loading="isFetching"
      />

      <!-- Evaluation -->
      <ProjectEvaluationPanel id="evaluation-panel" :scores="scores" :loading="isFetching" />

      <!-- Data Basis/ POIs -->
      <ProjectPoiPanel
        id="poi-panel"
        :project="projectStore.project"
        :pois="projectStore.pois"
        :loading="isFetching"
        class="col-span-full"
        @refresh-pois="refetchPois"
      />
    </div>

    <!-- Action Bar -->
    <UIMenuActionBar :items="actionItems" />

    <!-- Edit Project Modal -->
    <ProjectForm
      v-if="projectStore.project && modalOpen"
      v-model:open="modalOpen"
      :project="projectStore.project"
    />

    <!-- Hidden content to produce map and chart exports -->
    <ProjectExportAssets
      v-if="projectStore.project && projectStore.pois && scores"
      ref="exportAssetsRef"
      :project="projectStore.project"
      :pois="projectStore.pois"
      :scores="scores"
    />
  </template>
</template>

<script setup lang="ts">
import ProjectEvaluationPanel from '@/components/project/panels/ProjectEvaluationPanel.vue'
import ProjectMapPanel from '@/components/project/panels/ProjectMapPanel.vue'
import ProjectPoiPanel from '@/components/project/panels/ProjectPoiPanel.vue'
import ProjectExportAssets from '@/components/project/ProjectExportAssets.vue'
import ProjectForm from '@/components/project/ProjectForm.vue'
import ProjectSearchBar from '@/components/project/ProjectSearchBar.vue'
import type { MenuListItem } from '@/components/ui/menu/types'
import UIMenuActionBar from '@/components/ui/menu/UIMenuActionBar.vue'
import UISkeletonLoader from '@/components/ui/skeleton/UISkeletonLoader.vue'
import UIErrorPage from '@/components/ui/UIErrorPage.vue'
import UIPageHeader from '@/components/ui/UIPageHeader.vue'
import { useGeocodingService } from '@/composables/api/geocoding'
import { usePoiService } from '@/composables/api/poi'
import useDB from '@/composables/db'
import { useDownload } from '@/composables/download'
import { useEvaluation } from '@/composables/evaluation'
import type { EvaluationScores } from '@/composables/evaluation/types'
import { useNotification } from '@/composables/notification'
import { usePDF } from '@/composables/pdf'
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
const pdfService = usePDF()
const { downloadPDF } = useDownload()
const { calcScores } = useEvaluation()
const {
  loading: geodataLoading,
  data: geocodingData,
  error: geocodingError,
  getGeocoding,
} = useGeocodingService()
const { data: pois, error: poisError, loading: poiLoading, getPois } = usePoiService()

const exportAssetsRef = useTemplateRef('exportAssetsRef')

// TODO: Decide if we should move scores to the store
const scores = ref<EvaluationScores | null>(null)

const modalOpen = ref(false)

// State flags
const projectLoading = ref(false)
const reportLoading = ref(false)
const projectError = ref(false)

// Indicates if any data fetching is in progress
const isFetching = computed(() => geodataLoading.value || poiLoading.value || projectLoading.value)

const actionItems = computed<MenuListItem[]>(() => [
  {
    label: t('navigation.home'),
    icon: 'home',
    action: () => router.push('/'),
    divider: true,
  },
  {
    label: t('action.editItem', { item: t('project.label') }),
    icon: 'edit',
    action: () => (modalOpen.value = true),
    disabled: !projectStore.project,
  },
  {
    label: t('project.report.label'),
    icon: 'report',
    action: generateReport,
    disabled: !projectStore.project || reportLoading.value, // disable while report is generating
  },
  {
    label: t('action.save'),
    icon: 'save',
    action: saveProject,
    disabled: !projectStore.project,
  },
])

// Load the project and POIs when the user enters the page
onMounted(loadProject)

// Reset the project state when user leaves the page
onUnmounted(projectStore.reset)

// Prompt user if they try to leave the page with unsaved changes
onBeforeRouteLeave(async (_, __, next) => {
  if (projectStore.isDirty) {
    const confirmLeave = await confirmDialog({
      message: t('dialog.unsavedChanges'),
    })
    if (confirmLeave) {
      return next()
    }
    return next(false)
  }

  return next()
})

async function loadProject() {
  projectLoading.value = true
  projectError.value = false

  // Fetch the project and POIs from the database
  const projectId = route.params.projectId as string
  const [projectResponse, poisResponse] = await Promise.all([
    db.getProject(projectId),
    db.getPois(projectId),
  ])

  projectLoading.value = false

  // If there is an error in the database, show error
  if (projectResponse.error || poisResponse.error) {
    projectError.value = true
    console.log(projectResponse.error || poisResponse.error)
    errorToast(t('notification.error.load'))
    return
  }

  // If no project or POIs are found, show error message
  if (!projectResponse.data || !poisResponse.data) {
    projectError.value = true
    errorToast(t('project.error.projectNotFound'))
    projectStore.reset()
    return
  }

  // Set the project and POIs in the store
  projectStore.syncProjectState({ project: projectResponse.data, pois: poisResponse.data })
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
    errorToast(t('notification.error.save'))
    return
  }

  // If no project or POIs are found, show error message
  if (!projectResponse.data || !poisResponse.data) {
    errorToast(t('notification.error.load'))
    return
  }

  // Show success message
  successToast(t('notification.success.save'))

  // Update the project and POIs in the store
  projectStore.syncProjectState({ project: projectResponse.data, pois: poisResponse.data })
}

async function search(query: string, radius: number) {
  if (!query || radius <= 0 || !projectStore.project) return

  const toast = await loadingToast(t('notification.info.fetching'))

  // Get geocoding results for the query
  await getGeocoding(query)

  // If there is an error in the geocode service, show error
  if (geocodingError.value) {
    console.log(geocodingError.value)
    errorToast(t('notification.error.default'))
    return
  }

  // If no results are found, show an error message
  if (!geocodingData.value || geocodingData.value.length === 0) {
    errorToast(t('project.error.locationNotFound'))
    return
  }

  // TODO: Implement autocomplete to select a location from the results
  // For now, we just take the first result
  const location = geocodingData.value[0]

  // Update project store with new location and radius
  projectStore.updateProjectState({
    project: { ...projectStore.project, ...location, radius: radius },
  })

  // Fetch POIs for the new location
  await fetchPois()

  toast.dismiss()
}

async function refetchPois() {
  // Show loading toast
  const toast = await loadingToast(t('notification.info.fetching'))

  // Fetch POIs for the current project location
  await fetchPois()

  // Dismiss loading toast
  toast.dismiss()
}

async function fetchPois() {
  if (
    !projectStore.project?.latitude ||
    !projectStore.project?.longitude ||
    !projectStore.project?.radius
  )
    return

  // Reset scores
  scores.value = null

  // Get POIs for the selected project location
  await getPois(
    projectStore.project?.latitude,
    projectStore.project?.longitude,
    projectStore.project?.radius,
    projectStore.project.id,
  )

  // If there is an error in the POI service, show error
  if (poisError.value) {
    console.error(poisError.value)
    errorToast(t('notification.error.default'))
  }

  // Update project store with POIs
  if (pois.value) {
    projectStore.updateProjectState({ pois: pois.value })
  }
}

async function generateReport() {
  // Skip if already loading
  if (reportLoading.value) return

  // Ensure we have all necessary data
  if (!projectStore.project || !projectStore.pois || !scores.value || !exportAssetsRef.value) {
    errorToast(t('notification.error.default'))
    return
  }

  reportLoading.value = true
  const toast = await loadingToast(t('project.report.generating'))

  // Generate map and chart images
  const { maps, chart } = await exportAssetsRef.value?.exportAssets()

  // Create the PDF report
  await pdfService.createReport({
    project: projectStore.project,
    pois: projectStore.pois,
    scores: scores.value,
    chart,
    maps,
  })

  reportLoading.value = false

  // If there is an error in creating the PDF, show error
  if (pdfService.error.value) {
    console.error(pdfService.error.value)
    errorToast(t('notification.error.default'))
    return
  }

  if (pdfService.pdf.value) {
    // Finally download the PDF
    downloadPDF(
      new Blob([new Uint8Array(pdfService.pdf.value)]),
      `${projectStore.project.title}.pdf`,
    )

    // Reset loading state
    toast.dismiss()
  }
}

// (Re-)calculate scores after POIs are loaded or changed
watch(
  () => projectStore.pois,
  () => {
    if (
      projectStore.pois &&
      projectStore.project?.latitude &&
      projectStore.project?.longitude &&
      projectStore.project?.radius
    ) {
      scores.value = calcScores(projectStore.pois, projectStore.project.radius)
      projectStore.updateProjectState({
        project: { ...projectStore.project, score: scores.value.total },
      })
    }
  },
  { immediate: true, deep: true },
)
</script>
