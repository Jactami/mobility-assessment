<template>
  <RouterLink :to="`/project/${project.id}`">
    <BaseCard :animation="true" class="group flex flex-col">
      <!-- Card Header -->
      <div class="relative overflow-hidden">
        <img
          src="/img/placeholder.webp"
          :alt="project.title"
          loading="lazy"
          class="aspect-video object-cover object-center transition-transform duration-300 group-hover:scale-110"
        />
        <span
          class="absolute top-2 right-2 text-2xl text-primary transition-transform hover:scale-125"
          :title="project.favorite ? t('project.removeFavorite') : t('project.addFavorite')"
          @click.prevent="emit('favorite')"
        >
          <IconRenderer v-if="project.favorite" icon="favorite" />
          <IconRenderer v-else icon="noFavorite" class="hidden group-hover:block" />
        </span>
      </div>

      <!-- Card Body -->
      <div class="grow p-4">
        <h2 class="line-clamp-2 h-[3rem] text-lg leading-tight font-medium">{{ project.title }}</h2>
        <div class="mt-4 text-on-surface-variant">
          <div class="truncate">{{ project.street }} {{ project.housenumber }}</div>
          <div class="truncate">{{ project.postcode }} {{ project.city }}</div>
        </div>
      </div>

      <!-- Card Footer -->
      <div
        class="relative flex items-center justify-between gap-x-1 bg-surface-container-lowest py-1 pr-1 pl-4 text-on-surface-variant"
      >
        <time class="text-xs" :datetime="project.created_at">{{ d(project.created_at) }}</time>
        <MenuPopup :items="menu" />
      </div>
    </BaseCard>
  </RouterLink>
</template>

<script setup lang="ts">
import BaseCard from '@/components/base/BaseCard.vue'
import MenuPopup from '@/components/menu/MenuPopup.vue'
import type { MenuActionItem } from '@/components/menu/types'
import type { Project } from '@/db/types'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import IconRenderer from '../icon/IconRenderer.vue'

const props = defineProps<{
  project: Project
}>()

const emit = defineEmits<{
  (e: 'delete'): void
  (e: 'copy'): void
  (e: 'favorite'): void
}>()

const { d, t } = useI18n()

const menu = computed<MenuActionItem[]>(() => [
  {
    label: props.project.favorite ? t('project.removeFavorite') : t('project.addFavorite'),
    icon: props.project.favorite ? 'noFavorite' : 'favorite',
    action: () => emit('favorite'),
  },
  {
    label: t('project.copy'),
    icon: 'copy',
    action: () => emit('copy'),
    divider: true,
  },
  {
    label: t('project.delete'),
    icon: 'delete',
    action: () => emit('delete'),
  },
])
</script>
