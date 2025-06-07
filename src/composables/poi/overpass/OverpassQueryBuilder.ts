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
    // Note: use 'out geom center' instead to include geometry in the output
    const result = `[out:json]; (${this.query}); out center;`
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
    this.query += `nwr[${tag}](around:${radius},${lat},${lon});`
    return this
  }
}
