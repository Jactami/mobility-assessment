<template>
  <div>TODO</div>
  <pre>{{ profiles }}</pre>
  <pre>{{ authStore.role }}</pre>
</template>

<script setup lang="ts">
import { supabase } from '@/db'
import { useAuthStore } from '@/stores/Auth'
import { onMounted, ref } from 'vue'

const authStore = useAuthStore()

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
