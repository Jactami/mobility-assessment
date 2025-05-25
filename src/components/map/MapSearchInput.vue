<template>
  <div class="flex items-start gap-2">
    <FormKit v-model="query" type="search" autocomplete="off" autofocus @keydown.enter="search" />
    <BaseButton @click="search">Go</BaseButton>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import { useGeoService } from '@/composables/geo'
import { useLogger } from '@/composables/log'
import { ref } from 'vue'

const { getGeoCode } = useGeoService()
const logger = useLogger('map')

const query = ref('')

async function search() {
  const data = await getGeoCode(query.value)

  if (data && data.length > 0) {
    const { lat, lon } = data[0]
    logger.log(`Latitude: ${lat}, Longitude: ${lon}`)
  } else {
    logger.error('No results found for the query:', query.value)
  }
}
</script>
