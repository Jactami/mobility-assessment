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
import { useLogger } from '@/composables/log'
import { useNotification } from '@/composables/notification'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { loading, geocode, error, getGeoCode } = useGeoService()
const { errorToast } = useNotification()
const logger = useLogger('map')

const query = ref('')

async function search() {
  if (loading.value) return
  if (!query.value.trim()) return

  await getGeoCode(query.value)

  if (error.value) errorToast(t('common.errorMessage'))

  if (geocode.value && geocode.value.length > 0) {
    const { lat, lon } = geocode.value[0]
    logger.log(`Latitude: ${lat}, Longitude: ${lon}`)
  }
}
</script>
