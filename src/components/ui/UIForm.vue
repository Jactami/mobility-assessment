<template>
  <!-- TODO: Decide whether modal should be part of this component or handled externally -->
  <UIModal v-model="open" :title="title">
    <FormKit
      id="edit-project-form"
      v-model="model"
      #default="{ state: { valid } }"
      type="form"
      :actions="false"
      @submit="handleSubmit"
    >
      <div class="flex flex-col gap-4">
        <slot>
          <!-- Input elements go here... -->
        </slot>
      </div>

      <!-- Control buttons -->
      <div class="mt-10 flex justify-center gap-2">
        <UIButton severity="neutral" @click="open = false">{{ t('common.cancel') }}</UIButton>
        <UIButton type="submit" :disabled="!valid">{{ t('common.save') }}</UIButton>
      </div>
    </FormKit>
  </UIModal>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
import { useI18n } from 'vue-i18n'
import UIButton from './button/UIButton.vue'
import UIModal from './UIModal.vue'

defineProps<{
  title?: string
  id: string
}>()

const emit = defineEmits<{
  (e: 'submit', model: T): void
}>()

const open = defineModel<boolean>('open')
const model = defineModel<T>('model', { required: true })

const { t } = useI18n()

function handleSubmit() {
  open.value = false
  emit('submit', model.value)
}
</script>
