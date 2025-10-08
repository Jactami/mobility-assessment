<template>
  <FormKit type="form" :actions="false" @submit="handleSubmit">
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
import { useUtil } from '@/composables/util/misc'
import type { Project } from '@/db/types'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  project: Project
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'search', query: string, radius: number): void
}>()

const { n, t } = useI18n()
const { createAddress } = useUtil()

const query = ref()
const radius = ref()

const radiusOptions = [200, 500, 1000, 1200, 1500, 2000] // in meters

function handleSubmit() {
  if (props.loading) return
  if (!query.value.trim()) return

  emit('search', query.value.trim(), radius.value)
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
