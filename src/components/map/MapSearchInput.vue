<template>
  <div class="flex items-start">
    <FormKit
      id="map-search-input"
      v-model="query"
      type="text"
      :label="t('project.location')"
      label-class="sr-only"
      :placeholder="t('project.location')"
      inner-class="rounded-r-none"
      role="searchbox"
      autocomplete="off"
      :disabled="loading"
      @keydown.enter="search"
    >
      <template #suffixIcon>
        <button
          v-if="query && !loading"
          class="cursor-pointer hover:text-primary"
          @click="query = ''"
        >
          <IconRenderer icon="clear" />
        </button>
        <IconRenderer v-else-if="loading" icon="loading" />
      </template>
    </FormKit>
    <BaseButton
      classes="text-lg rounded-l-none"
      :disabled="loading || query.trim() === ''"
      @click="search"
    >
      <IconRenderer icon="search" />
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import IconRenderer from '@/components/icon/IconRenderer.vue'
import { useGeoService } from '@/composables/geo'
import { useNotification } from '@/composables/notification'
import { useProjectStore } from '@/stores/Project'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { loading, geocode, error, getGeoCode } = useGeoService()
const { errorToast } = useNotification()
const projectStore = useProjectStore()

const query = ref('')

async function search() {
  if (loading.value) return
  if (!query.value.trim()) return

  await getGeoCode(query.value)

  if (error.value) errorToast(t('common.errorMessage'))

  if (geocode.value && geocode.value.length > 0) {
    // Parse response into coordinates and address
    const { lat, lon } = geocode.value[0]
    const city =
      geocode.value[0].address.city ||
      geocode.value[0].address.town ||
      geocode.value[0].address.village
    const zip = geocode.value[0].address.postcode
    const street = geocode.value[0].address.road || geocode.value[0].address.village // small villages might not have a road
    const number = geocode.value[0].address.house_number

    // Update store
    projectStore.update({
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
      city,
      zip_code: zip,
      street,
      street_number: number,
    })
  }
}
</script>
