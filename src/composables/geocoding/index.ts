import axios from 'axios'
import { ref } from 'vue'
import type { GeocodeJSON, GeocodeJSONFeature } from './types'

/**
 * Composable function to interact with geocoding services.
 */
export function useGeocodingService() {
  const data = ref<GeocodeJSONFeature[] | null>(null)

  // see: https://alexop.dev/posts/best-practices-for-error-handling-in-vue-composables/
  const loading = ref<boolean>(false)
  const error = ref<Error | null>(null)

  /**
   * Get geocoding information from OpenStreetMap's Nominatim service.
   *
   * @param search Search query for geocoding
   * @returns An array of geocoding results.
   */
  async function getGeocoding(search: string) {
    // Remove extra whitespace and replace spaces with plus signs
    const query = search.trim().replace(/ /g, '+')

    try {
      // Reset state before making a new request
      loading.value = true
      data.value = null
      error.value = null

      // Fetch geocoding data from Nominatim
      const response = await axios.get<GeocodeJSON>('https://nominatim.openstreetmap.org/search', {
        params: {
          q: query,
          format: 'geocodejson',
          addressdetails: 1,
          limit: 5,
          'accept-language': 'de',
        },
      })

      if (response.status !== 200) throw new Error(response.statusText)

      data.value = response.data.features
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
    getGeocoding,
  }
}
