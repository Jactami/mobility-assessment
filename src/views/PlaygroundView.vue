<template>
  <h1>Playground</h1>
  <p>New components and features can be developed and tested here.</p>
</template>

<script setup lang="ts">
import { useLogger } from '../composables/log'

useLogger().log('Logger running...')
</script>
