<template>
  <RouterLink :to="`/project/${project.id}`">
    <UICard :animation="true" class="group flex flex-col">
      <!-- Card Header -->
      <div class="relative overflow-hidden">
        <div
          class="bg-surface-container-high text-on-surface-inverse flex aspect-[3/1] items-center justify-center p-4 transition-transform duration-300 group-hover:scale-110"
          :style="{ backgroundColor: bgColor }"
        >
          <div class="text-5xl font-semibold">
            {{
              typeof project.score === 'number'
                ? n(project.score * 100, 'rounded')
                : t('common.notAvailable')
            }}
          </div>
        </div>
        <span
          class="text-secondary absolute right-2 top-2 text-2xl transition-transform hover:scale-125"
          :title="project.favorite ? t('project.removeFavorite') : t('project.addFavorite')"
          @click.prevent="emit('favorite')"
        >
          <UIIcon v-if="project.favorite" icon="favorite" />
          <UIIcon v-else icon="noFavorite" class="hidden group-hover:block" />
        </span>
      </div>

      <!-- Card Body -->
      <div class="grow p-4">
        <h2 v-mark="search" class="line-clamp-2 h-[3rem] text-xl font-medium leading-tight">
          {{ project.title }}
        </h2>
        <div v-mark="search" class="text-on-surface-variant mt-4">
          <div v-for="(part, i) in address" :key="i" class="truncate">{{ part }}</div>
        </div>
      </div>

      <!-- Card Footer -->
      <div
        class="bg-surface-container-lowest text-on-surface-variant relative flex items-center justify-between gap-x-1 py-1 pl-4 pr-1"
      >
        <time class="text-xs" :datetime="project.created_at">{{ d(project.created_at) }}</time>
        <UIMenu :items="menu" />
      </div>
    </UICard>
  </RouterLink>
</template>

<script setup lang="ts">
import UIIcon from '@/components/ui/icon/UIIcon.vue'
import type { MenuListItem } from '@/components/ui/menu/types'
import UIMenu from '@/components/ui/menu/UIMenu.vue'
import UICard from '@/components/ui/UICard.vue'
import { useColorUtil } from '@/composables/util/color'
import { useUtil } from '@/composables/util/misc'
import type { Project } from '@/db/types'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  project: Project
  search?: string
}>()

const emit = defineEmits<{
  (e: 'delete'): void
  (e: 'copy'): void
  (e: 'favorite'): void
}>()

const { d, n, t } = useI18n()
const { scoreToColor } = useColorUtil()
const { createAddress } = useUtil()

const address = computed(() => {
  const address = createAddress(props.project)
  return address.split(',').map((part) => part.trim())
})

const bgColor = computed(() =>
  typeof props.project.score === 'number' ? scoreToColor(props.project.score) : '',
)

const menu = computed<MenuListItem[]>(() => [
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
