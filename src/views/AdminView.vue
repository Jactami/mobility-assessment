<template>
  <div>TODO</div>
  <pre>{{ profiles }}</pre>
</template>

<script setup lang="ts">
import { supabase } from '@/db'
import { onMounted, ref } from 'vue'

const profiles = ref()

onMounted(async () => {
  const { data, error } = await supabase.from('profiles').select()

  if (error) {
    console.error('Error fetching profiles:', error)
    return
  }

  console.log(data)
  profiles.value = data
})
</script>
