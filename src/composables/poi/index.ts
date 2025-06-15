import { DOMAINS } from '@/constants'
import type { Poi } from '@/db/types'
import axios from 'axios'
import { ref } from 'vue'
import { OverpassQueryFactory } from './overpass/OverpassQueryFactory'
import type { OverpassElement, OverpassResponse } from './types'

export function usePoiService() {
  const data = ref<Poi[] | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<Error | null>(null)

  /**
   * Fetches Points of Interest (POIs) within a specified radius from a given latitude and longitude.
   * @param lat Latitude of the location.
   * @param lon Longitude of the location.
   * @param radius Radius (in meters) to search for POIs.
   * @param projectId The ID of the project to associate with the POIs.
   */
  async function getPois(lat: number, lon: number, radius: number, projectId: string) {
    // Fetch Overpass elements
    const elements = await fetchOverpassElements(lat, lon, radius)

    // Process and transform Overpass response into POIs
    if (!elements) {
      data.value = null
    } else {
      data.value = transformOverpassElementsToPois(elements, projectId)
    }
  }

  /**
   * Fetch Overpass elements within a specified radius from a given latitude and longitude.
   * @param lat Latitude of the location.
   * @param lon Longitude of the location.
   * @param radius Radius (in meters) to search for POIs.
   */
  async function fetchOverpassElements(lat: number, lon: number, radius: number) {
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

      return response.data.elements
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('An unknown error occurred')
    } finally {
      loading.value = false
    }
  }

  /**
   * Transforms Overpass elements into Point of Interest (POI) objects.
   * @param elements - The Overpass elements to transform.
   * @param projectId - The project ID to associate with the POIs.
   * @returns An array of POI objects.
   */
  function transformOverpassElementsToPois(elements: OverpassElement[], projectId: string): Poi[] {
    return elements.map((element) => ({
      osm_id: element.id,
      osm_type: element.type,
      project_id: projectId,
      label: element.tags?.name,
      category: getPoiCategory(element),
      latitude: element.type === 'node' ? element.lat : element.center.lat,
      longitude: element.type === 'node' ? element.lon : element.center.lon,
    }))
  }

  /**
   * Categorizes an Overpass element into a POI category.
   * @param element - The Overpass element to categorize.
   * @returns The POI category.
   */
  function getPoiCategory(element: OverpassElement) {
    return (
      DOMAINS.flatMap((domain) => domain.categories).find(
        (category) => category.tagValue === element.tags?.[category.tagKey],
      )?.tagValue ?? 'unknown'
    )
  }

  return {
    data,
    loading,
    error,
    getPois,
  }
}
