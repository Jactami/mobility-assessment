<template>
  <nav v-if="route.path !== '/'" class="mb-6 text-on-surface-variant">
    <ol class="flex flex-wrap">
      <li v-for="(r, i) in routes" :key="r.fullPath" class="flex items-center">
        <RouterLink
          :to="r.fullPath"
          class="flex items-center rounded-full px-2.5 py-1.5 hover:bg-primary-container hover:text-on-primary-container"
          :class="{ 'bg-primary-container text-on-primary-container': i === routes.length - 1 }"
        >
          <IconRenderer v-if="i === 0" icon="home" />
          <span v-else class="text-sm">{{ t(`meta.${r.name?.toString()}`) }}</span>
        </RouterLink>
        <IconRenderer v-if="i < routes.length - 1" class="mx-1" icon="next" />
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import IconRenderer from '@/components/icon/IconRenderer.vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const routes = computed(() => [router.resolve({ name: 'home' }), route])
</script>
