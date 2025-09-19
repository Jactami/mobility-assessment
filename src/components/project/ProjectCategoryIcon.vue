<template>
  <img :src="url" :alt="t(`category.${props.category}`)" aria-hidden="true" />
</template>

<script setup lang="ts">
import { useIcon } from '@/composables/icon'
import { useColorUtil } from '@/composables/util/color'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  category: string
  color?: string
}>()

const { t } = useI18n()
const { getUrl } = useIcon()
const { categoryToColor } = useColorUtil()

/** Color of the icon, either from the color prop or derived from the category. */
const iconColor = computed(() => props.color ?? categoryToColor(props.category))

/** Data URL of the SVG icon with the appropriate color applied. */
const url = computed(() => getUrl(props.category, iconColor.value))
</script>
