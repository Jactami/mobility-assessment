import { factorConfig } from '@/config/app'
import type { FactorCategory, LocationFactor } from '@/config/app/types'
import { OverpassQueryBuilder } from './OverpassQueryBuilder'

/**
 * Factory for creating Overpass API queries.
 */
export class OverpassQueryFactory {
  private static readonly builder: OverpassQueryBuilder = new OverpassQueryBuilder()

  /**
   * Creates an Overpass API query for the specified location and radius.
   *
   * @param lat The latitude of the center point.
   * @param lon The longitude of the center point.
   * @param radius The radius around the center point (in meters).
   * @returns The Overpass API query string.
   */
  static createQuery(lat: number, lon: number, radius: number) {
    factorConfig.forEach((factor) => {
      this.queryFactor(factor, lat, lon, radius)
    })

    return this.builder.build()
  }

  /**
   * Appends a specific factor of categories to the Overpass query.
   *
   * @param factor The factor to query.
   * @param lat The latitude of the center point.
   * @param lon The longitude of the center point.
   * @param radius The radius around the center point (in meters).
   */
  private static queryFactor(factor: LocationFactor, lat: number, lon: number, radius: number) {
    for (const category of factor.categories) {
      this.queryCategory(category, lat, lon, radius)
    }
  }

  /**
   * Appends a specific category to the Overpass query.
   *
   * @param category The category to query.
   * @param lat The latitude of the center point.
   * @param lon The longitude of the center point.
   * @param radius The radius around the center point (in meters).
   */
  private static queryCategory(category: FactorCategory, lat: number, lon: number, radius: number) {
    category.tags.forEach((tag) => {
      this.builder.add(tag.key, tag.value, lat, lon, radius)
    })
  }
}
