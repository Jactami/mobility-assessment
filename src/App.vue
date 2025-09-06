<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />
    <main class="relative container mx-auto flex grow flex-col px-4 pt-6 pb-24 lg:px-10 lg:pb-10">
      <AppBreadcrumb />
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import AppBreadcrumb from '@/components/app/AppBreadcrumb.vue'
import AppHeader from '@/components/app/AppHeader.vue'
import { useAuthService } from '@/composables/auth'
import { onMounted } from 'vue'

// init auth state listener to sync auth store
// https://supabase.com/docs/guides/getting-started/tutorials/with-vue-3?queryGroups=database-method&database-method=sql#launch
onMounted(() => {
  useAuthService().init()
})
</script>
