<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />
    <main class="container mx-auto flex grow flex-col px-4 pt-6 pb-24 lg:px-10 lg:pb-10">
      <RouterView />
    </main>
    <footer class="bg-red-200">Test</footer>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/app/AppHeader.vue'
</script>
