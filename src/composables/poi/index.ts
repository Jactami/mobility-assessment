import { DOMAINS } from '@/constants'
import type { Poi } from '@/db/types'
import axios from 'axios'
import { getDistance } from 'ol/sphere'
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

    if (!elements) {
      data.value = null
    } else {
      // Process and transform Overpass response into POIs
      let pois = transformOverpassElementsToPois(elements, projectId)

      // Calculate distances for each POI
      pois = calculateDistances(lat, lon, pois)

      // Filter POIs by radius
      // Nodes of a way or relation might lay inside the radius, but the centroid is not.
      // TODO: Decide if these POIs should be filtered out or just marked and let user decide.
      pois = filterPoisByDistance(pois, radius)

      // assign the processed POIs to the data ref
      data.value = pois
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
      label: getPoiLabel(element),
      category: getPoiCategory(element),
      latitude: element.type === 'node' ? element.lat : element.center.lat,
      longitude: element.type === 'node' ? element.lon : element.center.lon,
      distance: Infinity, // Placeholder for distance, to be calculated later
    }))
  }

  /**
   * Categorizes an Overpass element into a POI category.
   * @param element - The Overpass element to categorize.
   * @returns The POI category.
   */
  function getPoiCategory(element: OverpassElement) {
    return (
      DOMAINS.flatMap((domain) => domain.categories).find((category) =>
        category.tags.some((tag) => tag.value === element.tags?.[tag.key]),
      )?.name ?? 'unknown'
    )
  }

  /**
   * Gets the label for a POI based on its tags and predefined rules.
   * @param element - The Overpass element to get the label for.
   * @returns The label for the POI, or null if no label can be determined.
   */
  function getPoiLabel(element: OverpassElement): string | null {
    for (const domain of DOMAINS) {
      for (const category of domain.categories) {
        const matchesTag = category.tags.some((tag) => element.tags?.[tag.key] === tag.value)

        if (!matchesTag) continue

        // Check labelRules, if any
        if (category.labelRules) {
          for (const rule of category.labelRules) {
            const ruleMatches = rule.matches.every(
              (match) => element.tags?.[match.key] === match.value,
            )

            if (ruleMatches) {
              // Full label
              if (rule.label) return rule.label

              // Fallback tag
              const name = rule.fallback ? element.tags?.[rule.fallback] : element.tags?.name

              // Prefix only (with optional name or operator fallback)
              if (rule.prefix) {
                if (name) return `${rule.prefix} ${name}`
                return rule.prefix
              }

              // Just return the name if available
              return name || null
            }
          }
        }

        // No label rule matched, fallback to name, then operator
        if (element.tags?.name) return element.tags.name
      }
    }

    return null
  }

  /**
   * Calculates the distance between two geographical points.
   * @param lat Latitude of the reference point.
   * @param lon Longitude of the reference point.
   * @param pois Array of POIs to calculate distances for.
   * @returns An array of POIs with calculated distances.
   */
  function calculateDistances(lat: number, lon: number, pois: Poi[]) {
    return pois.map((poi) => {
      const distance = getDistance([lon, lat], [poi.longitude, poi.latitude])
      poi.distance = Math.round(distance * 100) / 100 // Round to two decimal places
      return poi
    })
  }

  /**
   * Filters POIs by distance based on a specified threshold.
   * @param pois Array of POIs to filter.
   * @param threshold Distance threshold.
   * @returns Filtered array of POIs.
   */
  function filterPoisByDistance(pois: Poi[], threshold: number): Poi[] {
    return pois.filter((poi) => poi.distance <= threshold)
  }

  return {
    data,
    loading,
    error,
    getPois,
  }
}
