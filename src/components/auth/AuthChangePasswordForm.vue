<template>
  <div class="max-w-lg">
    <FormKit
      id="change-password-form"
      #default="{ state: { valid } }"
      type="form"
      :actions="false"
      @submit="handlePasswordReset"
    >
      <!-- TODO: add old password field to validate user against current password -->
      <!-- TODO: Add password restrictions -->
      <FormKit
        id="password"
        :type="passwordVisible ? 'text' : 'password'"
        :label="t('auth.passwordNew')"
        name="password"
        :placeholder="t('auth.passwordNew')"
        validation="required"
      >
        <template #suffix>
          <button
            type="button"
            tabindex="-1"
            class="cursor-pointer p-0.5 hover:text-primary"
            @mousedown="passwordVisible = true"
            @mouseup="passwordVisible = false"
          >
            <IconRenderer v-if="passwordVisible" icon="hide" />
            <IconRenderer v-else icon="show" />
          </button>
        </template>
      </FormKit>
      <FormKit
        id="password-confirm"
        type="password"
        :label="t('auth.passwordConfirm')"
        name="password_confirm"
        :placeholder="t('auth.passwordConfirm')"
        validation="required|confirm"
      />

      <BaseButton type="submit" :disabled="!valid || loading">
        {{ t('auth.changePassword') }}
      </BaseButton>
    </FormKit>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import IconRenderer from '@/components/icon/IconRenderer.vue'
import { useAuthService } from '@/composables/auth'
import { useNotification } from '@/composables/notification'
import { useAuthStore } from '@/stores/Auth'
import { reset } from '@formkit/core'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface ChangePasswordFormData {
  password: string
  password_confirm: string
}

const { t } = useI18n()
const authService = useAuthService()
const authStore = useAuthStore()
const { errorToast, successToast } = useNotification()

const passwordVisible = ref(false)
const loading = ref(false)

async function handlePasswordReset(formData: ChangePasswordFormData) {
  loading.value = true
  const { error } = await authService.updateUser(authStore.user?.email, formData.password)
  loading.value = false

  if (error) {
    console.error(error)
    errorToast(t('auth.changePasswordError'))
  } else {
    successToast(t('auth.changePasswordSuccess'))
    reset('change-password-form')
  }
}
</script>
