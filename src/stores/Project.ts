import type { Project } from '@/db/types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

/**
 * Store to create a shadow project to temporarily hold project data without saving it to the database.
 * This is useful for creating new projects or editing existing ones without immediately committing changes.
 *
 * TODO: Add history tracking to allow undo/redo functionality.
 */
export const useProjectStore = defineStore('project', () => {
  const _project = ref<Project | null>(null)

  const project = computed(() => _project.value)

  /**
   * Initializes the current project.
   *
   * @param newProject - Partial project data to update or initialize the project.
   */
  function set(project: Project) {
    _project.value = project
  }

  /**
   * Updates the current project and merges it with the new data.
   *
   * @param newProject - Partial project data to update the current project.
   */
  function update(newProject: Partial<Project>) {
    if (!_project.value) {
      console.warn('Attempted to update a project that has not been set.')
      return
    }

    _project.value = { ..._project.value, ...newProject }
  }

  /**
   * Resets the project store, clearing the current project data.
   */
  function reset() {
    _project.value = null
  }

  return {
    project,
    reset,
    update,
    set,
  }
})
