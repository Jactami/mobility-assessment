<template>
  <component :is="iconComponent" :aria-label="label" :aria-hidden="!label" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { icons, type Icon } from './types'

const props = defineProps<{
  icon: Icon
  label?: string
}>()

const iconComponent = computed(() => icons[props.icon])
</script>
