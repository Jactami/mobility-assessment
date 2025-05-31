import { OverpassQueryBuilder } from './OverpassQueryBuilder'

/**
 * Factory for creating Overpass API queries.
 */
export class OverpassQueryFactory {
  private static readonly builder: OverpassQueryBuilder = new OverpassQueryBuilder()

  static createQuery(lat: number, lon: number, radius: number) {
    this.querySupermarkets(lat, lon, radius)
    return this.builder.build()
  }

  static querySupermarkets(lat: number, lon: number, radius: number) {
    this.builder.add('shop=supermarket', lat, lon, radius)
  }

  // More query methods will be added here...
}
