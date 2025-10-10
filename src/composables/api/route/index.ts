import axios from 'axios'
import axiosRetry from 'axios-retry'
import { ref } from 'vue'
import type { OrsResponse } from './types'

const baseURL = import.meta.env.VITE_ORS_URL

export function useRouteService() {
  const data = ref<{ distance: number; route: [number, number][] } | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)

  /**
   * Get a route between two points.
   * @param startLat Starting latitude
   * @param startLon Starting longitude
   * @param endLat Ending latitude
   * @param endLon Ending longitude
   * @returns The route data including distance and coordinates.
   */
  async function getRoute(startLat: number, startLon: number, endLat: number, endLon: number) {
    try {
      // Reset state
      loading.value = true
      error.value = null
      data.value = null

      // Fetch route from ORS API
      const response = await fetchRoute(startLat, startLon, endLat, endLon)

      // Process ORS response
      data.value = transformOrsResponseToRoute(response, startLat, startLon, endLat, endLon)

      return data.value
    } catch (err) {
      const e = err instanceof Error ? err : new Error('An unknown error occurred')
      error.value = e
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch route data from Open Route Service
   * @param startLat Starting latitude
   * @param startLon Starting longitude
   * @param endLat Ending latitude
   * @param endLon Ending longitude
   * @returns ORS API response
   */
  async function fetchRoute(startLat: number, startLon: number, endLat: number, endLon: number) {
    const response = await axios.get<OrsResponse>('/ors/v2/directions/foot-walking', {
      baseURL,
      params: {
        start: `${startLon},${startLat}`,
        end: `${endLon},${endLat}`,
        preference: 'shortest',
      },
      // Configure retries as multiple concurrent requests might overload ORS server
      // TODO: Decide whether to globally configure axios-retry instead
      'axios-retry': {
        retries: 3,
        retryDelay: axiosRetry.exponentialDelay, // exponential backoff
        // Only retry on network errors or idempotent requests (5xx)
        retryCondition: (error) => axiosRetry.isNetworkOrIdempotentRequestError(error),
        // onRetry: (err) => console.log(`Retrying request: ${err}`),
      },
    })

    if (response.status !== 200) throw new Error(response.statusText)

    return response.data
  }

  /**
   * Transform ORS API response to route data.
   * @param response ORS API response
   * @param startLat Starting latitude
   * @param startLon Starting longitude
   * @param endLat Ending latitude
   * @param endLon Ending longitude
   * @returns The route data including distance and coordinates.
   */
  function transformOrsResponseToRoute(
    response: OrsResponse,
    startLat: number,
    startLon: number,
    endLat: number,
    endLon: number,
  ) {
    const feature = response.features[0]
    if (!feature) return null

    const distance = feature?.properties.summary.distance
    const route = feature?.geometry.coordinates

    const startPoint: [number, number] = [startLon, startLat]
    const endPoint: [number, number] = [endLon, endLat]

    route.unshift(startPoint)
    route.push(endPoint)

    // TODO: Decide if distance should be recalculated to include start and end points

    return { distance, route }
  }

  return {
    getRoute,
    loading,
    error,
    data,
  }
}
