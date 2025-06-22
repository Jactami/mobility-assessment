<template>
  <div>TODO</div>
  <button @click="addUser">Add User</button>
</template>

<script setup lang="ts">
import { supabase } from '@/db'

async function addUser() {
  const { data, error } = await supabase.rpc('create_user', {
    first_name: 'Test',
    last_name: 'BGW',
    email: 'test@bgw24.de',
    password: 'test', // make sure to change this later!
  })

  if (error) {
    console.error('Error creating user:', error)
  } else {
    console.log('User created with ID:', data)
  }
}
</script>
