/**
 * OverpassQueryBuilder is a utility class to build Overpass API queries.
 *
 * An example query might look like this:
 * ```
 * [out:json];
 * (
 *  node[shop=supermarket](around:1000,49.8926840,10.9080738);
 *  way[shop=supermarket](around:1000,49.8926840,10.9080738);
 *  relation[shop=supermarket](around:1000,49.8926840,10.9080738);
 * );
 * out geom;
 */
export class OverpassQueryBuilder {
  private query: string

  constructor() {
    this.query = ''
  }

  build(): string {
    const result = `[out:json]; (${this.query}); out geom;`
    this.reset()
    return result
  }

  reset(): this {
    this.query = ''
    return this
  }

  /**
   * Adds a node, way and relation with the specified tag around a given location.
   *
   * @param tag The tag to search for (e.g., "shop=supermarket").
   * @param lat The latitude of the center point.
   * @param lon The longitude of the center point.
   * @param radius The radius around the center point (in meters).
   * @returns The OverpassQueryBuilder instance.
   */
  add(tag: string, lat: number, lon: number, radius: number): this {
    return this.addNode(tag, lat, lon, radius)
      .addWay(tag, lat, lon, radius)
      .addRelation(tag, lat, lon, radius)
  }

  private addNode(tag: string, lat: number, lon: number, radius: number): this {
    this.query += `node[${tag}](around:${radius},${lat},${lon});`
    return this
  }

  private addWay(tag: string, lat: number, lon: number, radius: number): this {
    this.query += `way[${tag}](around:${radius},${lat},${lon});`
    return this
  }

  private addRelation(tag: string, lat: number, lon: number, radius: number): this {
    this.query += `relation[${tag}](around:${radius},${lat},${lon});`
    return this
  }
}
