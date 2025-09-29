import { useProjectUtil } from '@/composables/util/project'
import type { Poi, Project } from '@/db/types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

/**
 * Single source of truth for the current project data and UI state.
 * This store mitigates prop drilling and event propagation.
 *
 * TODO: Add setters and getter for secure data manipulation
 * TODO: Decide whether to fetch data and handle loading and error state here or in view
 */
export const useProjectStore = defineStore('project', () => {
  // Data
  const project = ref<Project | null>(null)
  const pois = ref<Poi[] | null>(null)

  // Original data to check for changes
  const originalProject = ref<Project | null>(null)
  const originalPois = ref<Poi[] | null>(null)

  // UI states
  const selectedPoi = ref<Poi | null>(null)
  const dimensionFilter = ref<string | null>(null)

  // Check if data has unsaved changes
  const isDirty = computed(
    () =>
      JSON.stringify(project.value) !== JSON.stringify(originalProject.value) ||
      JSON.stringify(pois.value) !== JSON.stringify(originalPois.value),
  )

  const filteredPois = computed(() => {
    if (!dimensionFilter.value || !pois.value) return pois.value
    return useProjectUtil().getPoisByDimension(pois.value, dimensionFilter.value)
  })

  function syncProjectState(state: { project: Project; pois: Poi[] }) {
    // Store original data for change detection
    originalProject.value = state.project
    originalPois.value = state.pois

    // Set current data
    updateProjectState(state)
  }

  function updateProjectState(state: { project?: Project; pois?: Poi[] }) {
    // Update project
    if (state.project) {
      project.value = state.project
    }

    // Update POIs
    if (state.pois) {
      pois.value = state.pois

      // Check if selected POI still exists in the updated list
      if (selectedPoi.value && !state.pois.find((p) => p.id === selectedPoi.value?.id)) {
        selectedPoi.value = null
      }
    }
  }

  function setFilter(dimension: string | null) {
    dimensionFilter.value = dimension

    // Check if selected POI still exists in the filtered list
    if (selectedPoi.value && !filteredPois.value?.find((p) => p.id === selectedPoi.value?.id)) {
      selectedPoi.value = null
    }
  }

  /**
   * Resets the project store and clears the current project data.
   */
  function reset() {
    project.value = null
    pois.value = null
    selectedPoi.value = null
    dimensionFilter.value = null
  }

  return {
    project,
    pois,
    originalProject,
    originalPois,
    selectedPoi,
    dimensionFilter,
    isDirty,
    filteredPois,
    syncProjectState,
    updateProjectState,
    setFilter,
    reset,
  }
})
