<template>
  <RouterLink :to="`/project/${project.id}`">
    <BaseCard>
      <div class="overflow-hidden">
        <img
          src="/img/placeholder.webp"
          :alt="project.title"
          class="aspect-video object-cover object-center transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div class="p-4">
        <h2 class="line-clamp-2 h-[3rem] text-lg leading-tight font-medium">{{ project.title }}</h2>
        <div class="mt-4 text-on-surface-variant">
          <div class="truncate">{{ project.street }} {{ project.street_number }}</div>
          <div class="truncate">{{ project.zip_code }} {{ project.city }}</div>
        </div>
      </div>
      <div class="flex justify-end bg-surface-container-lowest p-1">
        <MenuPopup :menu="menu" />
      </div>
    </BaseCard>
  </RouterLink>
</template>

<script setup lang="ts">
import BaseCard from '@/components/base/BaseCard.vue'
import MenuPopup from '@/components/menu/MenuPopup.vue'
import type { Menu } from '@/components/menu/types'
import { useLogger } from '@/composables/log'
import type { Project } from '@/db/types'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  project: Project
}>()

const { t } = useI18n()

const menu: Menu = [
  {
    label: t('project.delete'),
    icon: 'delete',
    action: () => useLogger().log('TODO: delete project', props.project.title),
  },
]
</script>
