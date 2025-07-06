<template>
  <RouterLink :to="`/project/${project.id}`">
    <BaseCard :animation="true" class="group flex flex-col">
      <!-- Card Header -->
      <div class="relative overflow-hidden">
        <div
          class="flex aspect-[3/1] items-center justify-center bg-surface-container-high p-4 text-on-surface-inverse transition-transform duration-300 group-hover:scale-110"
          :style="{ backgroundColor: bgColor }"
        >
          <div class="text-5xl font-semibold">
            {{ project.score ? n(project.score * 100, 'rounded') : t('common.notAvailable') }}
          </div>
        </div>
        <span
          class="absolute top-2 right-2 text-2xl text-secondary transition-transform hover:scale-125"
          :title="project.favorite ? t('project.removeFavorite') : t('project.addFavorite')"
          @click.prevent="emit('favorite')"
        >
          <IconRenderer v-if="project.favorite" icon="favorite" />
          <IconRenderer v-else icon="noFavorite" class="hidden group-hover:block" />
        </span>
      </div>

      <!-- Card Body -->
      <div class="grow p-4">
        <h2 class="line-clamp-2 h-[3rem] text-xl leading-tight font-medium">{{ project.title }}</h2>
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
import { useColorUtil } from '@/composables/util/color'
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

const { d, n, t } = useI18n()
const { scoreToColor } = useColorUtil()

const bgColor = computed(() => (props.project.score ? scoreToColor(props.project.score) : ''))

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
