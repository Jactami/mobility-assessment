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
  const _project = ref<Partial<Project> | null>(null)

  const project = computed(() => _project.value)

  function update(newProject: Partial<Project> | null) {
    _project.value = { ..._project.value, ...newProject }
  }

  function reset() {
    _project.value = null
  }

  return {
    project,
    reset,
    update,
  }
})
