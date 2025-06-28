<template>
  <IconButton
    :icon="isDark ? 'light' : 'dark'"
    :label="isDark ? 'Light Mode' : 'Dark Mode'"
    class="text-xl"
    @click="isDark = !isDark"
  />
</template>

<script setup lang="ts">
import IconButton from '@/components/icon/IconButton.vue'
import { useDark } from '@vueuse/core'

const isDark = useDark()
</script>
