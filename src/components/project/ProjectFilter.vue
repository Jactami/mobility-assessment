<template>
  <fieldset>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:auto-cols-fr lg:grid-flow-col">
      <template v-for="dimension in geoConfig" :key="dimension.name">
        <UISkeletonLoader :loading="loading" height="2.5rem">
          <label
            :aria-label="t(`dimension.${dimension.name}`)"
            class="has-focus-visible:outline-2 has-focus-visible:outline-offset-2 group relative rounded-full border-[1.5px] p-2 text-center shadow-sm"
            :style="{
              borderColor: dimension.color,
              outlineColor: dimension.color,
              backgroundColor: selectedDimension === dimension.name ? dimension.color : '',
            }"
          >
            <input
              type="radio"
              name="option"
              :value="dimension.name"
              :checked="selectedDimension === dimension.name"
              class="absolute inset-0 cursor-pointer appearance-none focus:outline-none"
              @click="toggleSelected(dimension.name)"
            />
            <span
              class="group-has-checked:text-on-surface-inverse text-on-surface-variant text-sm font-medium"
            >
              {{ t(`dimension.${dimension.name}`) }}
            </span>
          </label>
        </UISkeletonLoader>
      </template>
    </div>
  </fieldset>
</template>

<script setup lang="ts">
/**
 * A filter component to filter POIs by dimension.
 * TODO: Decide whether to use chips or dropdown.
 * TODO: Handle category filtering
 */

import UISkeletonLoader from '@/components/ui/skeleton/UISkeletonLoader.vue'
import { geoConfig } from '@/config/geo'
import { useProjectStore } from '@/stores/Project'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

defineProps<{
  loading?: boolean
}>()

const { t } = useI18n()
const projectStore = useProjectStore()

const selectedDimension = ref<string | null>(null)

function toggleSelected(dimension: string) {
  selectedDimension.value = selectedDimension.value === dimension ? null : dimension
  projectStore.setFilter(selectedDimension.value)
}
</script>
