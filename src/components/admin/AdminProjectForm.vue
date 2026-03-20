<template>
  <UIForm
    id="edit-project-form"
    v-model:open="open"
    v-model:model="model"
    :title="t('action.editItem', { item: t('project.label') })"
    @submit="handleSubmit"
  >
    <FormKit
      type="text"
      name="title"
      :label="t('project.title')"
      :placeholder="t('project.title')"
      validation="required"
    />

    <!-- TODO: Use autocomplete instead of select  -->
    <FormKit type="select" name="owner_id" :label="t('project.owner')">
      <option v-for="profile in sortedProfiles" :key="profile.id" :value="profile.id">
        {{ profile.last_name }} {{ profile.first_name }} ({{ profile.email }})
      </option>
    </FormKit>
  </UIForm>
</template>

<script setup lang="ts">
import type { Profile, Project } from '@/db/types'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import UIForm from '../ui/UIForm.vue'

const props = defineProps<{
  project: Project
  // TODO: Fetch profiles dynamically based on user input instead of preloading all profiles
  profiles: Profile[]
}>()

const emit = defineEmits<{
  (e: 'submit', project: Project): void
}>()

const open = defineModel<boolean>('open')

const { t } = useI18n()

const model = ref<Project>({ ...props.project })

const sortedProfiles = computed(() => {
  return [...props.profiles].sort((profileA, profileB) =>
    profileA.last_name.localeCompare(profileB.last_name),
  )
})

function handleSubmit(newProject: Project) {
  emit('submit', newProject)
}
</script>
