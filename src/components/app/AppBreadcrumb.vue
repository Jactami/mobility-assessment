<template>
  <nav v-if="route.path !== '/'" class="text-on-surface-variant mb-6">
    <ol class="flex flex-wrap">
      <li v-for="(r, i) in routes" :key="r.fullPath" class="flex items-center">
        <RouterLink
          :to="r.fullPath"
          :aria-label="t(`meta.${r.name?.toString()}`)"
          class="hover:bg-primary-container hover:text-on-primary-container flex items-center rounded-full px-2.5 py-1.5"
          :class="{ 'bg-primary-container text-on-primary-container': i === routes.length - 1 }"
        >
          <UIIcon v-if="i === 0" icon="home" :aria-label="t('meta.home')" />
          <span v-else class="text-sm">{{ t(`meta.${r.name?.toString()}`) }}</span>
        </RouterLink>
        <UIIcon v-if="i < routes.length - 1" class="mx-1" icon="next" />
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import UIIcon from '@/components/ui/icon/UIIcon.vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const routes = computed(() => [router.resolve({ name: 'home' }), route])
</script>
