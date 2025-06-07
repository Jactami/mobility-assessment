import { DOMAINS } from '@/constants'
import type { AreaCategory, AreaDomain } from '@/types'
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
    DOMAINS.forEach((domain) => {
      this.queryDomain(domain, lat, lon, radius)
    })

    return this.builder.build()
  }

  /**
   * Appends a specific domain of categories to the Overpass query.
   *
   * @param domain The domain to query.
   * @param lat The latitude of the center point.
   * @param lon The longitude of the center point.
   * @param radius The radius around the center point (in meters).
   */
  private static queryDomain(domain: AreaDomain, lat: number, lon: number, radius: number) {
    for (const category of domain.categories) {
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
  private static queryCategory(category: AreaCategory, lat: number, lon: number, radius: number) {
    this.builder.add(category.tagKey, category.tagValue, lat, lon, radius)
  }
}
