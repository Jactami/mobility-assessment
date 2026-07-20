<template>
  <UIForm
    id="edit-user-form"
    v-model:open="open"
    v-model:model="model"
    :title="
      isNewProfile
        ? t('action.addItem', { item: t('user.label') })
        : t('action.editItem', { item: t('user.label') })
    "
    :grid="true"
    @submit="handleSubmit"
  >
    <FormKit
      type="text"
      name="first_name"
      :label="t('user.firstName')"
      :placeholder="t('user.firstName')"
      validation="required"
    />
    <FormKit
      type="text"
      name="last_name"
      :label="t('user.lastName')"
      :placeholder="t('user.lastName')"
      validation="required"
    />
    <FormKit
      type="email"
      name="email"
      :label="t('user.email')"
      :placeholder="t('user.email')"
      validation="required|email"
      outer-class="col-span-full"
    />
    <FormKit
      type="date"
      name="expires_at"
      :label="`${t('user.expiresAt')} (${t('common.optional')})`"
      validation="date"
      :disabled="model.user_role === 'admin'"
      outer-class="col-span-full"
    />
    <FormKit
      type="checkbox"
      name="is_disabled"
      :label="t('user.disabled')"
      :disabled="model.user_role === 'admin'"
      outer-class="col-span-full"
    />
    <FormKit
      type="password"
      name="password"
      :label="isNewProfile ? t('user.password') : `${t('user.password')} (${t('common.optional')})`"
      :placeholder="t('user.password')"
      :validation="isNewProfile || model.password_confirm ? 'required' : ''"
    />
    <FormKit
      type="password"
      name="password_confirm"
      :label="t('auth.password.confirm')"
      :placeholder="t('auth.password.confirm')"
      :validation="isNewProfile || model.password ? 'required|confirm' : 'confirm'"
    />
  </UIForm>
</template>

<script setup lang="ts">
import UIForm from '@/components/ui/UIForm.vue'
import type { Profile } from '@/db/types'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ProfileWithPassword } from './types'

const props = defineProps<{
  profile?: Profile
}>()

const emit = defineEmits<{
  (e: 'submit', profile: Partial<ProfileWithPassword>): void
}>()

const open = defineModel<boolean>('open')

const { t } = useI18n()

const isNewProfile = computed(() => !props.profile?.id)

const model = ref<ProfileWithPassword>(createModel(props.profile))

function createModel(profile?: Profile) {
  return {
    ...profile,
    password: undefined,
    password_confirm: undefined,
  }
}

function handleSubmit(formData: ProfileWithPassword) {
  // Emit submit event with form data
  emit('submit', formData)
  // Reset model
  model.value = createModel()
}

// Set model to user profile on change
watch(
  () => props.profile,
  (newProfile) => {
    model.value = createModel(newProfile)
  },
  { immediate: true },
)
</script>
