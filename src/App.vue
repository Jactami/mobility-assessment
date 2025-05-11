<template>
  <div class="min-h-screen">
    <AppHeader />
    <div class="flex flex-col">
      <main class="container mx-auto flex grow flex-col px-4 pt-6 pb-24 lg:px-10 lg:pb-10">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/app/AppHeader.vue'
</script>
