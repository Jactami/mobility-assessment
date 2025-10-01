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

    <div>
      <FormKit
        type="range"
        name="radius"
        :label="t('project.radius')"
        validation="required|number|min:100|max:3000"
        outer-class="col-span-3"
        :min="100"
        :max="3000"
        :step="100"
        number
      >
        <template #help>
          <div class="text-on-surface-variant -mt-4">
            {{ n(model.radius ?? 0, 'meter') }}
          </div>
        </template>
      </FormKit>

      <div class="mt-2 flex flex-wrap gap-4">
        <UIButton
          v-for="radius in presetRadiusList"
          :key="radius"
          type="button"
          size="small"
          variant="secondary"
          @click="model.radius = radius"
        >
          {{ n(radius, 'meter') }}
        </UIButton>
      </div>
    </div>
  </UIForm>
</template>

<script setup lang="ts">
import type { Project } from '@/db/types'
import { useProjectStore } from '@/stores/Project'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import UIButton from '../ui/button/UIButton.vue'
import UIIcon from '../ui/icon/UIIcon.vue'
import UIForm from '../ui/UIForm.vue'

const props = defineProps<{
  project: Project
}>()

const emit = defineEmits<{
  (e: 'submit', project: Project): void
}>()

const open = defineModel<boolean>('open')

const { t, n } = useI18n()
const projectStore = useProjectStore()

const model = ref<Project>({ ...props.project })

const presetRadiusList = [500, 1000, 2000, 3000]

function handleSubmit() {
  projectStore.updateProjectState({ project: model.value })
  emit('submit', model.value)
}
</script>
