<template>
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <FormKit
      v-if="!authStore.user"
      #default="{ state: { valid } }"
      type="form"
      :actions="false"
      @submit="handleSignIn"
    >
      <FormKit
        id="email"
        type="email"
        :label="t('auth.email')"
        name="email"
        :placeholder="t('auth.email')"
        validation="required|email"
        autocomplete="email"
        autofocus
      />
      <FormKit
        id="password"
        :type="passwordVisible ? 'text' : 'password'"
        :label="t('auth.password')"
        name="password"
        :placeholder="t('auth.password')"
        inner-class="relative"
        validation="required"
      >
        <template #suffix>
          <div class="absolute inset-y-0 right-0 flex items-center pr-2">
            <IconButton
              tabindex="-1"
              :icon="passwordVisible ? 'hide' : 'show'"
              @mousedown="passwordVisible = true"
              @mouseup="passwordVisible = false"
            />
          </div>
        </template>
      </FormKit>
      <BaseButton type="submit" class="w-full" :disabled="!valid || loading">
        {{ t('auth.login') }}
      </BaseButton>
    </FormKit>
    <div v-else class="text-center">
      <p>{{ t('auth.loggedInAs', { user: authStore.user.email }) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import IconButton from '@/components/icon/IconButton.vue'
import { useAuthService } from '@/composables/auth'
import { useNotification } from '@/composables/notification'
import { useAuthStore } from '@/stores/Auth'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

interface SignInFormData {
  email: string
  password: string
}

const route = useRoute()
const router = useRouter()
const authService = useAuthService()
const authStore = useAuthStore()
const { t } = useI18n()
const { errorToast } = useNotification()

const loading = ref(false)
const passwordVisible = ref(false)

async function handleSignIn(form: SignInFormData) {
  // login user
  loading.value = true
  const { error } = await authService.signIn(form.email, form.password)
  loading.value = false

  // handle authentication errors
  if (error) {
    // TODO: handle more error cases
    const errorMessage =
      error.code === 'invalid_credentials' ? t('auth.invalidCredentials') : t('auth.loginError')
    errorToast(errorMessage)
    console.error(error)
    return
  }

  // forward user to redirect url or to home view
  const redirectPath = route.query.redirect?.toString()
  router.push(redirectPath ? { path: redirectPath } : { name: 'home' })
}
</script>
