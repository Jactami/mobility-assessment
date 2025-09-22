import { geoConfig } from '@/config/geo'
import type { Poi } from '@/db/types'

export function useProjectUtil() {
  return {
    getCategoriesByDimension,
    getClosestPois,
    getDimensionByName,
    getPoisByCategory,
    getPoisByDimension,
    sortPoisByDistance,
  }
}

/**
 * Gets a dimension by its name.
 * @param name - The name of the dimension to search for.
 * @returns The dimension object if found, or null.
 */
function getDimensionByName(name: string) {
  return geoConfig.find((dimension) => dimension.name === name) || null
}

/**
 * Gets the categories for a specific dimension.
 * @param dimension - The name of the dimension to get categories for.
 * @returns An array of category names for the specified dimension.
 */
function getCategoriesByDimension(dimension: string) {
  return getDimensionByName(dimension)?.categories.map((category) => category.name)
}

/**
 * Filters POIs by a specific dimension.
 * @param pois - The list of POIs to filter.
 * @param dimension - The name of the dimension to filter by.
 * @returns An array of POIs that belong to the specified dimension.
 */
function getPoisByDimension(pois: Poi[], dimension: string): Poi[] {
  const categories = getCategoriesByDimension(dimension) ?? []
  return pois.filter((poi) => categories?.includes(poi.category))
}

/**
 * Filters POIs by a specific category.
 * @param pois - The list of POIs to filter.
 * @param category - The name of the category to filter by.
 * @returns An array of POIs that belong to the specified category.
 */
function getPoisByCategory(pois: Poi[], category: string): Poi[] {
  return pois.filter((poi) => poi.category === category)
}

/**
 * Gets the closest POIs for each category.
 * @param pois - The list of POIs to filter.
 * @returns An array of the closest POIs for each category.
 */
function getClosestPois(pois: Poi[]): Poi[] {
  return pois.reduce((acc: Poi[], poi) => {
    const index = acc.findIndex((p) => p.category === poi.category)
    if (!acc[index]) {
      // First POI of this category
      acc.push(poi)
    } else if (poi.distance < acc[index].distance) {
      // Found a closer POI for this category
      acc[index] = poi
    }
    return acc
  }, [])
}

function sortPoisByDistance(pois: Poi[], ascending = true): Poi[] {
  return [...pois].sort((a, b) => (ascending ? a.distance - b.distance : b.distance - a.distance))
}
