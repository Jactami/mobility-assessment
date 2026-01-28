import axios from 'axios'
import { ref } from 'vue'
import { ServiceError } from '../error'
import type { Address, GeocodeJSON, GeocodeJSONFeature } from './types'

/**
 * Composable function to interact with geocoding services.
 */
export function useGeocodingService() {
  const service = 'Nominatim'

  const data = ref<Address[] | null>(null)
  // see: https://alexop.dev/posts/best-practices-for-error-handling-in-vue-composables/
  // TODO: write own generic useAsyncData wrapper to handle data, loading and error states
  const loading = ref<boolean>(false)
  const error = ref<ServiceError | null>(null)

  async function getGeocoding(search: string) {
    try {
      // Fetch geocoding data from Nominatim
      const geocoding = await fetchGeocoding(search)

      if (geocoding) {
        // Transform the geocoding data into a structured address format
        data.value = transformGeocodingToAddress(geocoding)
      } else {
        data.value = null
      }
    } catch (err) {
      if (err instanceof ServiceError) {
        error.value = err
      } else {
        error.value = new ServiceError(
          service,
          err instanceof Error ? err.message : 'An unknown error occurred',
        )
      }
    }
  }

  /**
   * Get geocoding information from OpenStreetMap's Nominatim service.
   *
   * @param search Search query for geocoding
   * @returns An array of geocoding results.
   */
  async function fetchGeocoding(search: string) {
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

      return response.data.features
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new ServiceError(service, err.message, err.response?.status)
      }

      throw new ServiceError(
        service,
        err instanceof Error ? err.message : 'An unknown error occurred',
      )
    } finally {
      loading.value = false
    }
  }

  /**
   * Transforms an array of geocoding features from Nominatim into a structured address format.
   * @param features Array of geocoding features from Nominatim
   * @returns Array of structured address objects
   */
  function transformGeocodingToAddress(features: GeocodeJSONFeature[]): Address[] {
    return features.map((feature) => {
      // Parse Nominatim response
      const longitude = Number((feature.geometry.coordinates[0] ?? 0).toFixed(7)), // Ensure lon + lat has 7 decimal places
        latitude = Number((feature.geometry.coordinates[1] ?? 0).toFixed(7)),
        name = feature.properties.geocoding.name,
        housenumber = feature.properties.geocoding.housenumber,
        // // Use district as fallback if street is not available (i.e., small villages)
        street = feature.properties.geocoding.street || feature.properties.geocoding.district,
        postcode = feature.properties.geocoding.postcode,
        city = feature.properties.geocoding.city,
        country = feature.properties.geocoding.country

      return {
        longitude,
        latitude,
        name: housenumber && street ? undefined : name, // If housenumber and street are present, we do not need the name
        housenumber,
        street: housenumber ? street : undefined, // If no housenumber is present, we do not need the street
        postcode,
        city,
        country,
      }
    })
  }

  return {
    data,
    loading,
    error,
    getGeocoding,
  }
}
