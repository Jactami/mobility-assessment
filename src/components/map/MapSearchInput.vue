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
          @click="resetQuery"
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
import { useLogger } from '@/composables/log'
import { useNotification } from '@/composables/notification'
import { useProjectStore } from '@/stores/Project'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { loading, error, geocode, getGeoCode, details, getLocationDetails } = useGeoService()
const { errorToast } = useNotification()
const projectStore = useProjectStore()

const query = ref('')

async function search() {
  if (loading.value) return
  if (!query.value.trim()) return

  await getGeoCode(query.value)

  // If there is an error in the geocode service, show error and reset project store
  if (error.value) {
    errorToast(t('common.errorMessage'))
    projectStore.reset()
    return
  }

  // If no geocode results, show error and reset project store
  if (!geocode.value || geocode.value.length === 0) {
    errorToast(t('project.locationNotFound'))
    projectStore.reset()
    return
  }

  console.log(geocode.value)

  // Parse response into coordinates and address
  const [lon, lat] = geocode.value[0].geometry.coordinates
  const housenumber = geocode.value[0].properties.geocoding.housenumber
  const street =
    // small villages might not have street names, so we use district or name as fallback
    geocode.value[0].properties.geocoding.street || geocode.value[0].properties.geocoding.district
  const postcode = geocode.value[0].properties.geocoding.postcode
  const city = geocode.value[0].properties.geocoding.city
  const country = geocode.value[0].properties.geocoding.country

  // Update store
  projectStore.update({
    latitude: Number(lat.toFixed(7)),
    longitude: Number(lon.toFixed(7)),
    housenumber,
    street,
    postcode,
    city,
    country,
  })

  // Get details for the location
  // TODO: Decide where to put this logic, maybe in the store?
  if (
    !projectStore.project?.latitude ||
    !projectStore.project?.longitude ||
    !projectStore.project?.radius
  )
    return

  await getLocationDetails(
    projectStore.project?.latitude,
    projectStore.project?.longitude,
    projectStore.project?.radius,
  )
  if (error.value) {
    errorToast(t('common.errorMessage'))
  }
  if (details.value) {
    useLogger().log('Location details:', details.value)
  }
}

function resetQuery() {
  // I do not like this, but it is the only way to focus the input element at the moment.
  // https://github.com/orgs/formkit/discussions/812
  const input = document.getElementById('map-search-input') as HTMLInputElement
  if (input) {
    input.focus()
    input.select()
  }
  query.value = ''
}

// update and initialize query string with project address
watch(
  () => projectStore.project,
  (newProject) => {
    if (newProject) {
      let address = ''
      address += projectStore.project?.street ? projectStore.project.street : ''
      address += projectStore.project?.housenumber ? ' ' + projectStore.project.housenumber : ''
      address += address ? ', ' : ''
      address += projectStore.project?.postcode ? projectStore.project.postcode + ' ' : ''
      address += projectStore.project?.city ? projectStore.project.city : ''

      query.value = address
    }
  },
  { immediate: true },
)
</script>
