<template>
  <UIPanel :title="t('project.pois')" icon="poi" :actions="actions">
    <!-- Category Summary Pills -->
    <div class="flex flex-wrap justify-center gap-2">
      <template v-for="dimension in geoConfig" :key="dimension.name">
        <template v-for="(category, i) in dimension.categories" :key="category.name">
          <UISkeletonLoader
            :loading="loading"
            :rounded="true"
            height="2rem"
            :width="`${7 + (i % 3) * 2}rem`"
          >
            <ProjectCategoryPill
              v-if="project?.latitude && project?.longitude"
              :category="category.name"
              :count="getPoisByCategory(pois ?? [], category.name).length"
            />
          </UISkeletonLoader>
        </template>
      </template>
    </div>

    <!-- POI Data Table -->
    <div class="mt-12">
      <UISkeletonLoader :loading="loading" height="10rem">
        <ProjectPoiTable v-if="pois" :pois="pois" />
      </UISkeletonLoader>
    </div>
  </UIPanel>
</template>

<script setup lang="ts">
import type { MenuListItem } from '@/components/ui/menu/types'
import UISkeletonLoader from '@/components/ui/skeleton/UISkeletonLoader.vue'
import UIPanel from '@/components/ui/UIPanel.vue'
import { useNotification } from '@/composables/notification'
import { useProjectUtil } from '@/composables/util/project'
import { geoConfig } from '@/config/geo'
import type { Poi, Project } from '@/db/types'
import { useI18n } from 'vue-i18n'
import ProjectCategoryPill from '../category/ProjectCategoryPill.vue'
import ProjectPoiTable from '../poi/ProjectPoiTable.vue'

defineProps<{
  project: Project | null
  pois: Poi[] | null
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'refresh-pois'): void
}>()

const { t } = useI18n()
const { getPoisByCategory } = useProjectUtil()
const { confirmDialog } = useNotification()

const actions: MenuListItem[] = [
  {
    label: t('project.refreshPois'),
    icon: 'refresh',
    action: async () => {
      // Inform user that existing data will be overwritten and user made data will be lost
      const confirmation = await confirmDialog(t('project.refreshPoisConfirm'))
      if (confirmation) emit('refresh-pois')
    },
  },
]
</script>
