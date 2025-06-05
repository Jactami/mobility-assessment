import type { Coordinate } from 'ol/coordinate'
import type Map from 'ol/Map'
import { getPointResolution, METERS_PER_UNIT } from 'ol/proj'

export function useMapUtils() {
  return {
    metersToPixels,
    zoomFromMeters,
  }
}

/**
 * Calculates the zoom level needed to fit an extent of a given dimension in meters within the current map view.
 *
 * @param map The OpenLayers map instance
 * @param center The center coordinate around which the zoom level is calculated
 * @param meters The distance in meters to convert
 * @returns The equivalent zoom level
 */
export function zoomFromMeters(map: Map, center: Coordinate, meters: number) {
  // Calculate the minimum size (width or height) of the map view
  const mapSize = map.getSize()
  const minSize = mapSize ? Math.min(...mapSize) : 0

  if (minSize === 0) return 0

  // Convert meters to pixels and calculate the zoom level
  const pixels = metersToPixels(map, center, meters)
  const resolution = pixels / minSize
  const zoom = Math.log2(156543.03392804097 / resolution) // 156543.03392804097 is the resolution at zoom level 0 for EPSG:3857

  return zoom
}

/**
 * Converts a distance in meters to pixels based on the current map view resolution.
 * https://stackoverflow.com/questions/23264721/how-to-draw-circle-with-radius-in-openlayers/28299599#28299599
 *
 * @param view The OpenLayers view instance
 * @param center The center coordinate around which the conversion is calculated
 * @param meters The distance in meters to convert
 * @returns The equivalent distance in pixels
 */
export function metersToPixels(map: Map, center: Coordinate, meters: number) {
  const resolutionAtEquator = map.getView().getResolution()
  if (resolutionAtEquator === undefined) return 0

  const projection = map.getView().getProjection()

  const resolutionAtLocation = getPointResolution(projection, resolutionAtEquator, center)
  const resolutionFactor = resolutionAtEquator / resolutionAtLocation
  const pixels = (meters / METERS_PER_UNIT.m) * resolutionFactor

  return pixels
}
