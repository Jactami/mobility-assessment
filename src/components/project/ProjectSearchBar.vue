<template>
  <FormKit type="form" :actions="false" @submit="search">
    <div class="flex flex-col items-center sm:flex-row sm:items-start">
      <!-- Radius Select -->
      <FormKit
        v-model.number="radius"
        type="select"
        name="radius"
        :placeholder="t('project.radius')"
        :label="t('project.radius')"
        label-class="sr-only"
        inner-class="sm:rounded-r-none focus-within:z-10"
        outer-class="sm:max-w-32 w-full"
        :disabled="loading"
      >
        <option
          v-for="radius in radiusOptions"
          :key="radius"
          :value="radius"
          :selected="radius === project?.radius"
        >
          {{ n(radius, 'meter') }}
        </option>
      </FormKit>

      <!-- Location Input -->
      <FormKit
        id="location-search-input"
        v-model="query"
        type="text"
        name="location"
        :label="t('project.location')"
        label-class="sr-only"
        :placeholder="t('project.location')"
        outer-class="w-full"
        inner-class="sm:-ml-px sm:rounded-none focus-within:z-10"
        role="searchbox"
        autocomplete="off"
        spellcheck="false"
        :disabled="loading"
        @keydown.enter="search"
      >
        <template #suffixIcon>
          <div class="relative w-6">
            <div class="absolute inset-y-0 -right-2 flex items-center">
              <UIButtonIcon
                v-if="query && !loading"
                icon="close"
                :aria-label="t('common.clear')"
                @click="resetQuery"
              />
              <UIIcon v-else-if="loading" icon="loading" :aria-label="t('common.loading')" />
            </div>
          </div>
        </template>
      </FormKit>

      <!-- Submit / Search Button -->
      <UIButton
        icon="search"
        :aria-label="t('common.search')"
        size="lg"
        type="submit"
        class="sm:-ml-px sm:rounded-l-none sm:text-lg"
        :disabled="loading || query.trim() === ''"
        @click="search"
      >
        <span class="not-sr-only sm:sr-only">
          {{ t('common.search') }}
        </span>
      </UIButton>
    </div>
  </FormKit>
</template>

<script setup lang="ts">
import UIButton from '@/components/ui/button/UIButton.vue'
import UIButtonIcon from '@/components/ui/button/UIButtonIcon.vue'
import UIIcon from '@/components/ui/icon/UIIcon.vue'
import { useGeocodingService } from '@/composables/api/geocoding'
import { usePoiService } from '@/composables/api/poi'
import { useNotification } from '@/composables/notification'
import { useUtil } from '@/composables/util/misc'
import type { Project } from '@/db/types'
import { useProjectStore } from '@/stores/Project'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  project: Project
}>()

const emit = defineEmits<{
  (e: 'update-location'): void
}>()

const { n, t } = useI18n()
const {
  data: geocoding,
  error: geocodingError,
  loading: geocodingLoading,
  getGeocoding,
} = useGeocodingService()
const { loading: poisLoading } = usePoiService()
const { errorToast } = useNotification()
const projectStore = useProjectStore()
const { createAddress } = useUtil()

const query = ref()
const radius = ref()

const loading = computed(() => geocodingLoading.value || poisLoading.value)

const radiusOptions = [200, 500, 1000, 1500, 2000] // in meters

async function search() {
  if (loading.value) return
  if (!query.value.trim()) return
  if (!projectStore.project) return

  // Get geocoding results for the query
  await getGeocoding(query.value)

  // If there is an error in the geocode service, show error
  if (geocodingError.value) {
    console.log(geocodingError.value)
    errorToast(t('notification.error.default'))
    return
  }

  // If no results are found, show an error message
  if (!geocoding.value || geocoding.value.length === 0) {
    errorToast(t('project.error.locationNotFound'))
    return
  }

  // TODO: Implement autocomplete to select a location from the results
  // For now, we just take the first result
  const location = geocoding.value[0]

  // Update project store with new location and radius
  projectStore.updateProjectState({
    project: { ...projectStore.project, ...location, radius: radius.value },
  })

  emit('update-location')
}

function resetQuery() {
  // I do not like this, but it is the only way to focus the input element at the moment.
  // https://github.com/orgs/formkit/discussions/812
  const input = document.getElementById('location-search-input') as HTMLInputElement
  if (input) {
    input.focus()
    input.select()
  }
  query.value = ''
}

// Update and initialize values
watch(
  () => props.project,
  (newProject) => {
    if (newProject) {
      // Update query string
      query.value = createAddress({
        name: newProject.name,
        street: newProject.street,
        housenumber: newProject.housenumber,
        postcode: newProject.postcode,
        city: newProject.city,
      })
      // Update radius
      radius.value = newProject.radius ?? 0
    }
  },
  { immediate: true },
)
</script>
