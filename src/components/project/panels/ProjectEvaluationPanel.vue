<template>
  <UIPanel :title="t('project.evaluation')" icon="evaluation">
    <!-- Total Score -->
    <div class="mx-auto max-w-xs">
      <UISkeletonLoader :loading="loading" height="10rem">
        <ProjectTotalScore :score="scores?.total" />
      </UISkeletonLoader>
    </div>

    <!-- Partial Scores -->
    <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 md:grid-cols-3">
      <template v-for="dimension in geoConfig" :key="dimension.name">
        <UISkeletonLoader :loading="loading" height="2rem">
          <ProjectPartialScore :dimension="dimension" :score="scores?.partial[dimension.name]" />
        </UISkeletonLoader>
      </template>
    </div>

    <!-- Score Chart -->
    <div class="mx-auto mt-3 h-auto w-full max-w-sm">
      <UISkeletonLoader :loading="loading" height="18rem">
        <ProjectScoreChart :scores="scores" />
      </UISkeletonLoader>
    </div>
  </UIPanel>
</template>

<script setup lang="ts">
import UISkeletonLoader from '@/components/ui/skeleton/UISkeletonLoader.vue'
import UIPanel from '@/components/ui/UIPanel.vue'
import type { EvaluationScores } from '@/composables/evaluation/types'
import { geoConfig } from '@/config/geo'
import { useI18n } from 'vue-i18n'
import ProjectPartialScore from '../evaluation/ProjectPartialScore.vue'
import ProjectScoreChart from '../evaluation/ProjectScoreChart.vue'
import ProjectTotalScore from '../evaluation/ProjectTotalScore.vue'

defineProps<{
  scores: EvaluationScores | null
  loading: boolean
}>()

const { t } = useI18n()
</script>
