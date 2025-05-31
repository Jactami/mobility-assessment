import axios from 'axios'
import { ref } from 'vue'
import { OverpassQueryFactory } from './overpass/OverpassQueryFactory'
import type { SearchResultItem } from './types'

// TODO: Do not reuse loading and error states for multiple requests
// see: https://alexop.dev/posts/best-practices-for-error-handling-in-vue-composables/
export function useGeoService() {
  const geocode = ref<SearchResultItem[] | null>(null)
  const details = ref<unknown[] | null>(null) // TODO: Define a proper type for location details
  const loading = ref<boolean>(false)
  const error = ref<Error | null>(null)

  /**
   * Get geocoding information from OpenStreetMap's Nominatim service.
   *
   * @param search Search query for geocoding
   * @returns An array of geocoding results.
   */
  async function getGeoCode(search: string) {
    // Remove extra whitespace and replace spaces with plus signs
    const query = search.trim().replace(/ /g, '+')

    try {
      // Reset state before making a new request
      loading.value = true
      geocode.value = null
      error.value = null

      // Fetch geocoding data from Nominatim
      const response = await axios.get<SearchResultItem[]>(
        'https://nominatim.openstreetmap.org/search',
        {
          params: {
            q: query,
            format: 'json',
            addressdetails: 1,
          },
        },
      )

      if (response.status !== 200) throw new Error(response.statusText)

      geocode.value = response.data
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('An unknown error occurred')
    } finally {
      loading.value = false
    }
  }

  async function getLocationDetails(lat: number, lon: number, radius: number) {
    try {
      // Reset state before making a new request
      loading.value = true
      error.value = null
      details.value = null

      // Fetch location details from Overpass API
      const response = await axios.get('https://overpass-api.de/api/interpreter', {
        params: {
          data: OverpassQueryFactory.createQuery(lat, lon, radius),
        },
      })

      if (response.status !== 200) throw new Error(response.statusText)

      details.value = response.data.elements
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('An unknown error occurred')
    } finally {
      loading.value = false
    }
  }

  return {
    geocode,
    loading,
    error,
    details,
    getGeoCode,
    getLocationDetails,
  }
}
