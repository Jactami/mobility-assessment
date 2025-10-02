<template>
  <UIForm
    id="edit-project-form"
    v-model:open="open"
    v-model:model="model"
    :title="t('project.config')"
    @submit="handleSubmit"
  >
    <FormKit
      type="text"
      name="title"
      :label="t('project.title')"
      :placeholder="t('project.title')"
      validation="required"
    />

    <FormKit type="checkbox" name="favorite" :label="t('project.addFavorite')">
      <template #decorator>
        <UIIcon :icon="model.favorite ? 'favorite' : 'noFavorite'" class="text-primary text-2xl" />
      </template>
    </FormKit>
  </UIForm>
</template>

<script setup lang="ts">
import type { Project } from '@/db/types'
import { useProjectStore } from '@/stores/Project'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import UIIcon from '../ui/icon/UIIcon.vue'
import UIForm from '../ui/UIForm.vue'

const props = defineProps<{
  project: Project
}>()

const emit = defineEmits<{
  (e: 'submit', project: Project): void
}>()

const open = defineModel<boolean>('open')

const { t } = useI18n()
const projectStore = useProjectStore()

const model = ref<Project>({ ...props.project })

function handleSubmit() {
  projectStore.updateProjectState({ project: model.value })
  emit('submit', model.value)
}
</script>
