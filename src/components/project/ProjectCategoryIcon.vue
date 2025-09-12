<template>
  <div
    class="inline-block mask-contain mask-center mask-no-repeat"
    :style="{
      WebkitMaskImage: `url(${imgUrl})`,
      maskImage: `url(${imgUrl})`,
      backgroundColor: imgColor,
    }"
    aria-hidden="true"
  />

  <!-- <img :src="`/img/icons/${category}.svg`" :alt="t(`category.${category}`)" /> -->
</template>

<script setup lang="ts">
/**
 * SVGs are not used inline due to compatibility issues with a vue3-openlayers library.
 * Instead, icons are loaded as external files and styled using CSS masks as a workaround.
 */

import { useColorUtil } from '@/composables/util/color'
import { computed } from 'vue'

const props = defineProps<{
  category: string
  color?: string
}>()

const { categoryToColor } = useColorUtil()

/**
 * URL to the icon image based on the category prop.
 */
const imgUrl = computed(() => `/img/icons/${props.category}.svg`)

/**
 * Color of the icon, either from the color prop or derived from the category.
 */
const imgColor = computed(() => props.color ?? categoryToColor(props.category))
</script>
