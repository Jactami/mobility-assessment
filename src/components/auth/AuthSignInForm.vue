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
        :label="t('user.email')"
        name="email"
        :placeholder="t('user.email')"
        validation="required|email"
        autocomplete="email"
        autofocus
      />
      <FormKit
        id="password"
        :type="passwordVisible ? 'text' : 'password'"
        :label="t('user.password')"
        name="password"
        :placeholder="t('user.password')"
        inner-class="relative"
        validation="required"
      >
        <template #suffix>
          <div class="relative w-6">
            <div class="absolute inset-y-0 -right-2 flex items-center">
              <UIButtonIcon
                tabindex="-1"
                :icon="passwordVisible ? 'hide' : 'show'"
                :aria-label="passwordVisible ? t('auth.password.hide') : t('auth.password.show')"
                @mousedown="passwordVisible = true"
                @mouseup="passwordVisible = false"
              />
            </div>
          </div>
        </template>
      </FormKit>
      <UIButton type="submit" size="lg" class="w-full" :disabled="!valid || loading">
        {{ t('auth.login') }}
      </UIButton>
    </FormKit>
    <div v-else class="text-center">
      <p>{{ t('auth.loggedInAs', { user: authStore.user.email }) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import UIButton from '@/components/ui/button/UIButton.vue'
import UIButtonIcon from '@/components/ui/button/UIButtonIcon.vue'
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
      error.code === 'invalid_credentials'
        ? t('auth.error.invalidCredentials')
        : t('auth.error.login')
    errorToast(errorMessage)
    console.error(error)
    return
  }

  // forward user to redirect url or to home view
  const redirectPath = route.query.redirect?.toString()
  router.push(redirectPath ? { path: redirectPath } : { name: 'home' })
}
</script>
