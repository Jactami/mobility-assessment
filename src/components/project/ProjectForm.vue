<template>
  <UIModal v-model="open" :title="t('project.config')">
    <FormKit
      id="edit-project-form"
      v-model="model"
      #default="{ state: { valid } }"
      type="form"
      :actions="false"
      @submit="handleSubmit"
    >
      <div class="flex flex-col gap-4">
        <FormKit
          type="text"
          name="title"
          :label="t('project.title')"
          :placeholder="t('project.title')"
          validation="required"
        />

        <FormKit type="checkbox" name="favorite" :label="t('project.addFavorite')">
          <template #decorator>
            <UIIcon
              :icon="model.favorite ? 'favorite' : 'noFavorite'"
              class="text-primary text-2xl"
            />
          </template>
        </FormKit>

        <div>
          <FormKit
            type="range"
            name="radius"
            :label="t('project.radius')"
            validation="required|number|min:0|max:3000"
            outer-class="col-span-3"
            :min="0"
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
      </div>

      <div class="mt-10 flex justify-center gap-2">
        <UIButton type="submit" :disabled="!valid">{{ t('common.save') }}</UIButton>
        <UIButton variant="secondary" @click="open = false">
          {{ t('common.cancel') }}
        </UIButton>
      </div>
    </FormKit>
  </UIModal>
</template>

<script setup lang="ts">
import UIModal from '@/components/ui/UIModal.vue'
import type { Project } from '@/db/types'
import { useProjectStore } from '@/stores/Project'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import UIButton from '../ui/button/UIButton.vue'
import UIIcon from '../ui/icon/UIIcon.vue'

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
  open.value = false
  emit('submit', model.value)
}
</script>
