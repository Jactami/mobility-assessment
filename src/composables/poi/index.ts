import axios from 'axios'
import { ref } from 'vue'
import { OverpassQueryFactory } from './overpass/OverpassQueryFactory'
import type { OverpassElement, OverpassResponse } from './types'

export function usePoiService() {
  const data = ref<OverpassElement[] | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<Error | null>(null)

  /**
   * Get points of interest (POIs) within a certain radius of a location.
   *
   * @param lat Latitude of the location.
   * @param lon Longitude of the location.
   * @param radius Radius (in meters) to search for POIs.
   */
  async function getPois(lat: number, lon: number, radius: number) {
    try {
      // Reset state before making a new request
      loading.value = true
      error.value = null
      data.value = null

      // Fetch location details from Overpass API
      const response = await axios.get<OverpassResponse>(
        'https://overpass-api.de/api/interpreter',
        {
          params: {
            data: OverpassQueryFactory.createQuery(lat, lon, radius),
          },
        },
      )

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
