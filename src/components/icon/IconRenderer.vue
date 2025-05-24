<!--
  AppIcon.vue

  A reusable icon wrapper component that enforces consistent icon usage across the app.
  - Maps semantic icon names (e.g. "copy", "delete") to specific icon sources (e.g. "lucide:copy").
  - Applies accessibility best practices: hides decorative icons from screen readers by default,
    or exposes meaningful icons with an aria-label and role="img".
  - Ensures consistent styling and simplifies future icon set changes.
-->

<template>
  <component :is="iconMap[icon]" :aria-label="label" :aria-hidden="!label" />
</template>

<script setup lang="ts">
import { iconMap, type Icon } from './types'

defineProps<{
  icon: Icon
  label?: string
}>()
</script>
