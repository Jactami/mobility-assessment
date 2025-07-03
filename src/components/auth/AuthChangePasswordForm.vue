<template>
  <div class="max-w-lg">
    <FormKit
      id="change-password-form"
      v-model="formModel"
      #default="{ state: { valid } }"
      type="form"
      :actions="false"
      @submit="handlePasswordReset"
    >
      <FormKit
        id="old-password"
        :type="oldPasswordVisible ? 'text' : 'password'"
        :label="t('auth.passwordOld')"
        name="old_password"
        :placeholder="t('auth.passwordOld')"
        inner-class="relative"
        validation="required"
      >
        <template #suffix>
          <div class="absolute inset-y-0 right-0 flex items-center pr-2">
            <IconButton
              tabindex="-1"
              :icon="oldPasswordVisible ? 'hide' : 'show'"
              @mousedown="oldPasswordVisible = true"
              @mouseup="oldPasswordVisible = false"
            />
          </div>
        </template>
      </FormKit>
      <FormKit
        id="new-password"
        :type="newPasswordVisible ? 'text' : 'password'"
        :label="t('auth.passwordNew')"
        name="new_password"
        :placeholder="t('auth.passwordNew')"
        inner-class="relative"
        validation="required|contains_alpha|contains_numeric|contains_symbol|contains_uppercase|length:8,64"
        :help="t('auth.passwordHelp')"
      >
        <template #suffix>
          <div class="absolute inset-y-0 right-0 flex items-center pr-2">
            <IconButton
              tabindex="-1"
              :icon="newPasswordVisible ? 'hide' : 'show'"
              @mousedown="newPasswordVisible = true"
              @mouseup="newPasswordVisible = false"
            />
          </div>
        </template>
      </FormKit>
      <FormKit
        id="new-password-confirm"
        type="password"
        :label="t('auth.passwordConfirm')"
        name="new_password_confirm"
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
import IconButton from '@/components/icon/IconButton.vue'
import { useAuthService } from '@/composables/auth'
import { useNotification } from '@/composables/notification'
import { useAuthStore } from '@/stores/Auth'
import { reset } from '@formkit/core'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const authService = useAuthService()
const authStore = useAuthStore()
const { errorToast, successToast } = useNotification()

const formModel = ref({
  old_password: '',
  new_password: '',
  new_password_confirm: '',
})

const newPasswordVisible = ref(false)
const oldPasswordVisible = ref(false)
const loading = ref(false)

async function handlePasswordReset() {
  loading.value = true

  // Validate the old password by re-signing in
  const { error: oldPasswordError } = await authService.signIn(
    authStore.user?.email || '',
    formModel.value.old_password,
  )

  if (oldPasswordError) {
    loading.value = false
    errorToast(t('auth.passwordOldInvalid'))
    return
  }

  // Update the password
  const { error: updateError } = await authService.updateUser(
    authStore.user?.email,
    formModel.value.new_password,
  )

  loading.value = false

  if (updateError) {
    console.error(updateError)
    errorToast(t('auth.changePasswordError'))
  } else {
    successToast(t('auth.changePasswordSuccess'))
    reset('change-password-form')
  }
}
</script>
