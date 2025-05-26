import axios from 'axios'
import { ref } from 'vue'

export function useGeoService() {
  // TODO: Add response type or use nominatim library
  // https://www.npmjs.com/package/nominatim-client
  const geocode = ref()
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
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: query,
          format: 'json',
          addressdetails: 1,
        },
      })

      if (response.status !== 200) throw new Error(response.statusText)

      geocode.value = response.data
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
    getGeoCode,
  }
}
