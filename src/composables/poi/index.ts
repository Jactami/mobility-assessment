import axios from 'axios'
import { ref } from 'vue'
import { OverpassQueryFactory } from './overpass/OverpassQueryFactory'

// TODO: Do not reuse loading and error states for multiple requests
// see: https://alexop.dev/posts/best-practices-for-error-handling-in-vue-composables/
export function usePoiService() {
  const data = ref<unknown[] | null>(null) // TODO: Define a proper type for location details
  const loading = ref<boolean>(false)
  const error = ref<Error | null>(null)

  async function getPois(lat: number, lon: number, radius: number) {
    try {
      // Reset state before making a new request
      loading.value = true
      error.value = null
      data.value = null

      // Fetch location details from Overpass API
      const response = await axios.get('https://overpass-api.de/api/interpreter', {
        params: {
          data: OverpassQueryFactory.createQuery(lat, lon, radius),
        },
      })

      if (response.status !== 200) throw new Error(response.statusText)

      data.value = response.data.elements
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('An unknown error occurred')
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    loading,
    error,
    getPois,
  }
}
