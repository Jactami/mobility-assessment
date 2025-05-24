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
      <BaseButton type="submit" classes="w-full" :disabled="!valid || loading">
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
import IconRenderer from '@/components/icon/IconRenderer.vue'
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
  try {
    loading.value = true

    // login user
    await authService.signIn(form.email, form.password)

    // forward user to redirect url or to home view
    const redirectPath = route.query.redirect?.toString()
    router.push(redirectPath ? { path: redirectPath } : { name: 'home' })
  } catch {
    errorToast(t('auth.loginError'))
  } finally {
    loading.value = false
  }
}
</script>
