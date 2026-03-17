<template>
  <RouterLink :to="`/project/${project.id}`">
    <UICard :animation="true" class="group flex flex-col">
      <!-- Card Header -->
      <div class="relative overflow-hidden">
        <div
          class="flex aspect-3/1 items-center justify-center bg-surface-container-high p-4 text-on-surface-inverse transition-transform duration-300 group-hover:scale-110"
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
          class="absolute top-2 right-2 text-2xl text-on-surface-inverse transition-transform hover:scale-125"
          :title="project.favorite ? t('project.favorite.remove') : t('project.favorite.add')"
          @click.prevent="emit('favorite')"
        >
          <UIIcon v-if="project.favorite" icon="favorite" />
          <UIIcon v-else icon="noFavorite" class="hidden group-hover:block" />
        </span>
      </div>

      <!-- Card Body -->
      <div class="grow space-y-4 p-4">
        <h2 v-mark="filter" class="line-clamp-2 min-h-12.5 text-xl leading-tight font-medium">
          {{ project.title }}
        </h2>
        <div v-mark="filter" class="text-on-surface-variant">
          <div v-for="(part, i) in address" :key="i" class="truncate">{{ part }}</div>
        </div>
        <div class="text-sm">
          <!-- TODO: Show radius as Badge or Pill? -->
          <div v-if="project.radius">{{ n(project.radius, 'meter') }}</div>
        </div>
      </div>

      <!-- Card Footer -->
      <div
        class="relative flex items-center justify-between gap-x-1 bg-surface-container py-1 pr-1 pl-4 text-on-surface-variant"
      >
        <time class="text-xs" :datetime="project.created_at">
          {{ d(project.created_at, 'short') }}
        </time>
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
import { useRouter } from 'vue-router'

const props = defineProps<{
  project: Project
  filter?: string
}>()

const emit = defineEmits<{
  (e: 'delete'): void
  (e: 'duplicate'): void
  (e: 'favorite'): void
}>()

const router = useRouter()
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
    label: props.project.favorite ? t('project.favorite.remove') : t('project.favorite.add'),
    icon: props.project.favorite ? 'noFavorite' : 'favorite',
    action: () => emit('favorite'),
  },
  {
    label: t('action.openItem', { item: t('project.label') }),
    icon: 'open',
    action: () => router.push({ name: 'project', params: { projectId: props.project.id } }),
  },
  {
    label: t('action.duplicateItem', { item: t('project.label') }),
    icon: 'copy',
    action: () => emit('duplicate'),
    divider: true,
  },
  {
    label: t('action.deleteItem', { item: t('project.label') }),
    icon: 'delete',
    action: () => emit('delete'),
  },
])
</script>
