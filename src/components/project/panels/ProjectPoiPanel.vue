<template>
  <UIPanel :title="t('project.pois')" icon="poi">
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
import UISkeletonLoader from '@/components/ui/skeleton/UISkeletonLoader.vue'
import UIPanel from '@/components/ui/UIPanel.vue'
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

const { t } = useI18n()
const { getPoisByCategory } = useProjectUtil()
</script>
