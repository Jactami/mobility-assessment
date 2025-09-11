<template>
  <UIButtonIcon
    :icon="isDark ? 'light' : 'dark'"
    :label="isDark ? 'Light Mode' : 'Dark Mode'"
    class="text-xl"
    @click="isDark = !isDark"
  />
</template>

<script setup lang="ts">
import { useDark } from '@vueuse/core'
import UIButtonIcon from '../ui/button/UIButtonIcon.vue'

const isDark = useDark()
</script>
