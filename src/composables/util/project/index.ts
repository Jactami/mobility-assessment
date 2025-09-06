import { DOMAINS } from '@/constants'
import type { Poi } from '@/db/types'

export function useProjectUtil() {
  return {
    getCategoriesByDomain,
    getClosestPois,
    getDomainByName,
    getPoisByCategory,
    getPoisByDomain,
    sortPoisByDistance,
  }
}

/**
 * Gets a domain by its name.
 * @param name - The name of the domain to search for.
 * @returns The domain object if found, or null.
 */
function getDomainByName(name: string) {
  return DOMAINS.find((domain) => domain.name === name) || null
}

/**
 * Gets the categories for a specific domain.
 * @param domain - The name of the domain to get categories for.
 * @returns An array of category names for the specified domain.
 */
function getCategoriesByDomain(domain: string) {
  return getDomainByName(domain)?.categories.map((category) => category.name)
}

/**
 * Filters POIs by a specific domain.
 * @param pois - The list of POIs to filter.
 * @param domain - The name of the domain to filter by.
 * @returns An array of POIs that belong to the specified domain.
 */
function getPoisByDomain(pois: Poi[], domain: string): Poi[] {
  const categories = getCategoriesByDomain(domain)
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
