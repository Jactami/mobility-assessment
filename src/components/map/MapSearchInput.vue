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
      spellcheck="false"
      :disabled="loading"
      @keydown.enter="search"
    >
      <template #suffixIcon>
        <div class="absolute inset-y-0 right-0 flex items-center pr-2">
          <IconButton v-if="query && !loading" icon="close" @click="resetQuery" />
          <IconRenderer v-else-if="loading" icon="loading" />
        </div>
      </template>
    </FormKit>
    <BaseButton
      class="rounded-l-none text-lg"
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
import { useGeocodingService } from '@/composables/geocoding'
import { useNotification } from '@/composables/notification'
import { usePoiService } from '@/composables/poi'
import { useUtil } from '@/composables/util/misc'
import { useProjectStore } from '@/stores/Project'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import IconButton from '../icon/IconButton.vue'

const emit = defineEmits<{
  (e: 'search-initiated'): void
  (e: 'search-completed'): void
}>()

const { t } = useI18n()
const {
  data: geocoding,
  error: geocodingError,
  loading: geocodingLoading,
  getGeocoding,
} = useGeocodingService()
const { data: pois, error: poisError, loading: poisLoading, getPois } = usePoiService()
const { errorToast } = useNotification()
const projectStore = useProjectStore()
const { createAddress } = useUtil()

const query = ref('')

const loading = computed(() => geocodingLoading.value || poisLoading.value)

async function search() {
  if (loading.value) return
  if (!query.value.trim()) return
  if (!projectStore.project?.id) return

  await getGeocoding(query.value)

  // If there is an error in the geocode service, show error
  if (geocodingError.value) {
    errorToast(t('common.errorMessage'))
    return
  }

  // If no results are found, show an error message
  if (!geocoding.value || geocoding.value.length === 0) {
    errorToast(t('project.locationNotFound'))
    return
  }

  // TODO: Implement autocomplete to select a location from the results
  // For now, we just take the first result
  const location = geocoding.value[0]

  // Update project store
  projectStore.updateProject({ ...location })

  if (
    !projectStore.project?.latitude ||
    !projectStore.project?.longitude ||
    !projectStore.project?.radius
  )
    return

  // Get POIs for the selected project location
  await getPois(
    projectStore.project?.latitude,
    projectStore.project?.longitude,
    projectStore.project?.radius,
    projectStore.project.id,
  )

  // If there is an error in the POI service, show error
  if (poisError.value) {
    errorToast(t('common.errorMessage'))
  }

  // Update project store with POIs
  if (pois.value) {
    projectStore.updatePois(pois.value)
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
      query.value = createAddress({
        name: newProject.name,
        street: newProject.street,
        housenumber: newProject.housenumber,
        postcode: newProject.postcode,
        city: newProject.city,
      })
    }
  },
  { immediate: true },
)

// Inform parent component about search status changes
watch(loading, (isLoading) => {
  if (isLoading) {
    emit('search-initiated')
  } else {
    emit('search-completed')
  }
})
</script>
