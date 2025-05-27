import Feature from 'ol/Feature'
import { Point } from 'ol/geom'
import { Vector } from 'ol/layer'
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
    drawLocation,
  }
}

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

function drawLocation(map: Map, lon: number, lat: number) {
  // Create a point for the location
  const feature = createPointFeature(lon, lat)

  // Append point to map
  const vectorSource = new VectorSource({ features: [feature] })
  const vectorLayer = new Vector({ source: vectorSource })
  map.addLayer(vectorLayer)
}
