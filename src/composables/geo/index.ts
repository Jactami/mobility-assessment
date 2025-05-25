import axios from 'axios'

export function useGeoService() {
  return {
    getGeoCode,
  }
}

/**
 * Get geocoding information from OpenStreetMap's Nominatim service.
 *
 * TODO: Add response type or use nominatim library
 * https://www.npmjs.com/package/nominatim-client
 *
 * @param search Search query for geocoding
 * @returns An array of geocoding results.
 */
async function getGeoCode(search: string) {
  // Remove extra whitespace and replace spaces with plus signs
  const query = search.trim().replace(/ /g, '+')

  try {
    // Fetch geocoding data from Nominatim
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: query,
        format: 'json',
        addressdetails: 1,
      },
    })

    if (response.status !== 200) throw new Error(response.statusText)

    return response.data
  } catch (error) {
    throw error
  }
}
