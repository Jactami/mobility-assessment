<template>
  <RouterLink
    class="group rounded border border-outline shadow transition-transform duration-300 hover:scale-105 hover:shadow-md"
    :to="`/project/${project.id}`"
  >
    <div class="overflow-hidden">
      <img
        src="/img/placeholder.webp"
        :alt="project.title"
        class="aspect-video object-cover object-center transition-transform duration-300 group-hover:scale-110"
      />
    </div>
    <div class="p-4">
      <h2 class="text-lg font-medium">{{ project.title }}</h2>
      <div class="mt-4 text-on-surface-variant">
        <div>{{ project.street }} {{ project.street_number }}</div>
        <div>{{ project.zip_code }} {{ project.city }}</div>
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import type { Project } from '@/db/types'

defineProps<{
  project: Project
}>()
</script>
