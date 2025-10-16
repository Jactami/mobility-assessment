<template>
  <fieldset>
    <div class="grid grid-cols-2 gap-1.5 sm:flex">
      <template v-for="factor in factorConfig" :key="factor.name">
        <UISkeletonLoader :loading="loading" :rounded="true" height="2rem">
          <label
            :aria-label="t(`factor.${factor.name}`)"
            class="group relative flex w-full justify-center rounded-full border-[1.5px] px-3 py-1.5 text-center shadow-sm has-focus-visible:outline-2 has-focus-visible:outline-offset-2"
            :style="{
              borderColor: factor.color,
              outlineColor: factor.color,
              backgroundColor: filter === factor.name ? factor.color : '',
            }"
          >
            <input
              type="radio"
              name="option"
              :value="factor.name"
              :checked="filter === factor.name"
              class="absolute inset-0 cursor-pointer appearance-none focus:outline-none"
              @click="toggleSelected(factor.name)"
            />
            <span
              class="text-xs font-medium text-on-surface-variant group-has-checked:text-on-surface-inverse"
            >
              {{ t(`factor.${factor.name}`) }}
            </span>
          </label>
        </UISkeletonLoader>
      </template>
    </div>
  </fieldset>
</template>

<script setup lang="ts">
/**
 * A filter component to filter POIs by factor.
 * TODO: Decide whether to use chips or dropdown.
 * TODO: Handle category filtering
 */

import UISkeletonLoader from '@/components/ui/skeleton/UISkeletonLoader.vue'
import { factorConfig } from '@/config/app'
import { useI18n } from 'vue-i18n'

defineProps<{
  loading?: boolean
}>()

const filter = defineModel<string | null>()

const { t } = useI18n()

function toggleSelected(factor: string) {
  filter.value = filter.value === factor ? null : factor
}
</script>
