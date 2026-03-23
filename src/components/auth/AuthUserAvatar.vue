<template>
  <div
    class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-mono font-medium text-on-primary select-none"
  >
    {{ initials }}
  </div>
</template>

<script setup lang="ts">
import type { Profile } from '@/db/types'
import { computed } from 'vue'

const props = defineProps<{
  profile: Profile
}>()

// Use initials for now, maybe support profile pictures in the future
const initials = computed(
  () => `${props.profile.first_name?.charAt(0) || ''}${props.profile.last_name?.charAt(0) || '?'}`,
)
</script>
