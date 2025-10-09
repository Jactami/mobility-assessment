import { factorConfig } from '@/config/app'
import type { Poi } from '@/db/types'
import axios from 'axios'
import { getDistance } from 'ol/sphere'
import pLimit from 'p-limit'
import { ref, shallowRef } from 'vue'
import { useRouteService } from '../route'
import { OverpassQueryFactory } from './overpass/OverpassQueryFactory'
import type { OverpassElement, OverpassResponse } from './types'

export function usePoiService() {
  const data = shallowRef<Poi[] | null>(null)
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
    // Reset state
    loading.value = true
    error.value = null
    data.value = null

    try {
      // Fetch Overpass elements within radius (as footpath can never be longer than direct distance)
      const elements = await fetchOverpassElements(lat, lon, radius)

      if (!elements) {
        data.value = null
      } else {
        // Process and transform Overpass response into POIs
        let pois = transformOverpassElementsToPois(elements, projectId)

        // Calculate distances for each POI
        pois = await setRoutes(lat, lon, pois)

        // Filter POIs by radius
        // Nodes of a way or relation might lay inside the radius, but the centroid is not.
        // TODO: Decide if these POIs should be filtered out or just marked and let user decide.
        pois = filterPoisByDistance(pois, radius)

        // assign the processed POIs to the data ref
        data.value = pois
      }
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('An unknown error occurred')
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch Overpass elements within a specified radius from a given latitude and longitude.
   * @param lat Latitude of the location.
   * @param lon Longitude of the location.
   * @param radius Radius (in meters) to search for POIs.
   */
  async function fetchOverpassElements(lat: number, lon: number, radius: number) {
    // Fetch location details from Overpass API
    const response = await axios.get<OverpassResponse>('https://overpass-api.de/api/interpreter', {
      params: {
        data: OverpassQueryFactory.createQuery(lat, lon, radius),
      },
    })

    if (response.status !== 200) throw new Error(response.statusText)

    return response.data.elements
  }

  /**
   * Transforms Overpass elements into Point of Interest (POI) objects.
   * @param elements - The Overpass elements to transform.
   * @param projectId - The project ID to associate with the POIs.
   * @returns An array of POI objects.
   */
  function transformOverpassElementsToPois(elements: OverpassElement[], projectId: string): Poi[] {
    const pois: Poi[] = []

    for (const element of elements) {
      const categories = getPoiCategories(element)
      for (const cat of categories) {
        pois.push({
          osm_id: element.id,
          osm_type: element.type,
          project_id: projectId,
          label: getPoiLabel(element),
          category: cat,
          latitude: element.type === 'node' ? element.lat : element.center.lat,
          longitude: element.type === 'node' ? element.lon : element.center.lon,
          footway: [],
          distance: Infinity,
        })
      }
    }

    return pois
  }

  /**
   * Categorizes an Overpass element into a POI category.
   * @param element - The Overpass element to categorize.
   * @returns The POI categories.
   */
  function getPoiCategories(element: OverpassElement) {
    return factorConfig
      .flatMap((factor) => factor.categories)
      .filter((category) => category.tags.some((tag) => tag.value === element.tags?.[tag.key]))
      .map((category) => category.name)
  }

  /**
   * Gets the label for a POI based on its tags and predefined rules.
   * @param element - The Overpass element to get the label for.
   * @returns The label for the POI, or null if no label can be determined.
   */
  function getPoiLabel(element: OverpassElement): string | null {
    for (const factor of factorConfig) {
      for (const category of factor.categories) {
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
   * Fetches routes and distances from a given location to each POI using the routing service.
   * @param lat Latitude of the starting location.
   * @param lon Longitude of the starting location.
   * @param pois Array of POIs to calculate routes for.
   * @returns An array of POIs with updated routes and distances.
   */
  async function setRoutes(lat: number, lon: number, pois: Poi[]): Promise<Poi[]> {
    // Limit concurrent requests to avoid overwhelming the routing service
    const limitValue = navigator.hardwareConcurrency
      ? Math.min(20, navigator.hardwareConcurrency * 2)
      : 10

    const limit = pLimit(limitValue)

    const updatedPois = await Promise.all(
      pois.map(async (poi) => {
        return limit(async () => {
          const { getRoute, data, error } = useRouteService()
          await getRoute(lat, lon, poi.latitude, poi.longitude)

          if (error.value) throw error.value

          return {
            ...poi,
            footway: data.value?.route,
            distance:
              data.value?.distance ?? calculateDistance(lat, lon, poi.latitude, poi.longitude), // fallback to direct path
          }
        })
      }),
    )

    return updatedPois
  }

  /**
   * Calculates the distance between two geographical points.
   * @param lat1 Latitude of the first point.
   * @param lon1 Longitude of the first point.
   * @param lat2 Latitude of the second point.
   * @param lon2 Longitude of the second point.
   * @returns The distance between the two points.
   */
  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const distance = getDistance([lon1, lat1], [lon2, lat2])
    return Math.round(distance * 100) / 100 // Round to two decimal places
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
    calculateDistance,
  }
}
