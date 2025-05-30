import Feature from 'ol/Feature'
import { Circle, Point } from 'ol/geom'
import { Vector } from 'ol/layer'
import VectorLayer from 'ol/layer/Vector'
import type Map from 'ol/Map'
import { fromLonLat } from 'ol/proj'
import VectorSource from 'ol/source/Vector'
import CircleStyle from 'ol/style/Circle'
import Fill from 'ol/style/Fill'
import Style from 'ol/style/Style'

/**
 * https://openlayers.org/en/latest/examples/draw-features.html
 */

export function useMap() {
  return {
    drawCircleAround,
    drawLocation,
    resetLayers,
  }
}

/**
 * Reset all vector layers on the map.
 *
 * @param map The OpenLayers map instance
 */
function resetLayers(map: Map) {
  const layers = [...map.getLayers().getArray()]
  layers.forEach((layer) => {
    if (layer instanceof VectorLayer) {
      map.removeLayer(layer)
    }
  })
}

/**
 * Helper function to append a feature to the map.
 *
 * @param map The OpenLayers map instance
 * @param feature The feature to append
 */
function appendFeatureToMap(map: Map, feature: Feature) {
  const vectorSource = new VectorSource({ features: [feature] })
  const vectorLayer = new Vector({ source: vectorSource })
  map.addLayer(vectorLayer)
}

/**
 * Create a point feature for the given coordinates.
 *
 * @param lon The longitude of the point
 * @param lat The latitude of the point
 * @returns The created point feature
 */
function createPointFeature(lon: number, lat: number) {
  const coordinates = fromLonLat([lon, lat])

  const feature = new Feature({
    geometry: new Point(coordinates),
  })

  feature.setStyle(
    new Style({
      image: new CircleStyle({
        radius: 10,
        fill: new Fill({ color: 'red' }),
      }),
    }),
  )

  return feature
}

/**
 * Draws a point on the map at the specified location.
 *
 * @param map The OpenLayers map instance
 * @param lon The longitude of the location
 * @param lat The latitude of the location
 */
function drawLocation(map: Map, lon: number, lat: number) {
  // Create a point for the location
  const feature = createPointFeature(lon, lat)

  // Append point to map
  appendFeatureToMap(map, feature)
}

/**
 * Draws a circle around a specified location on the map.
 *
 * @param map The OpenLayers map instance
 * @param lon The longitude of the center point
 * @param lat The latitude of the center point
 * @param radius The radius of the circle in meters
 */
function drawCircleAround(map: Map, lon: number, lat: number, radius: number) {
  // Create a circle around location
  const coordinates = fromLonLat([lon, lat])
  const feature = new Feature({
    geometry: new Circle(coordinates, radius),
  })

  // Append circle to map
  appendFeatureToMap(map, feature)
}
