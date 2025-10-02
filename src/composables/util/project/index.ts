import { factorConfig } from '@/config/app'
import type { Poi } from '@/db/types'

export function useProjectUtil() {
  return {
    getCategoriesByFactor,
    getClosestPois,
    getFactorByCategory,
    getFactorByName,
    getPoisByCategory,
    getPoisByFactor,
    sortPoisByDistance,
  }
}

/**
 * Gets a factor by its name.
 * @param name - The name of the factor to search for.
 * @returns The factor object if found, or null.
 */
function getFactorByName(name: string) {
  return factorConfig.find((factor) => factor.name === name) || null
}

/**
 * Gets the categories for a specific factor.
 * @param factor - The name of the factor to get categories for.
 * @returns An array of category names for the specified factor.
 */
function getCategoriesByFactor(factor: string) {
  return getFactorByName(factor)?.categories.map((category) => category.name)
}

/**
 * Gets a factor by a specific category.
 * @param category - The name of the category to search for.
 * @returns The factor object if found, or null.
 */
function getFactorByCategory(category: string) {
  return (
    factorConfig.find((factor) => factor.categories.some((cat) => cat.name === category)) || null
  )
}

/**
 * Filters POIs by a specific factor.
 * @param pois - The list of POIs to filter.
 * @param factor - The name of the factor to filter by.
 * @returns An array of POIs that belong to the specified factor.
 */
function getPoisByFactor(pois: Poi[], factor: string): Poi[] {
  const categories = getCategoriesByFactor(factor) ?? []
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
