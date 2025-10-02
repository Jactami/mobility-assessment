import type { Coordinate } from 'ol/coordinate'
import type Map from 'ol/Map'
import { getPointResolution, METERS_PER_UNIT } from 'ol/proj'

export function useMapUtils() {
  return {
    exportMapToImage,
    metersToPixels,
    zoomFromMeters,
  }
}

/**
 * Calculates the zoom level needed to fit an extent of a given factor in meters within the current map view.
 *
 * @param map The OpenLayers map instance
 * @param center The center coordinate around which the zoom level is calculated
 * @param meters The distance in meters to convert
 * @returns The equivalent zoom level
 */
function zoomFromMeters(map: Map, center: Coordinate, meters: number) {
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
function metersToPixels(map: Map, center: Coordinate, meters: number) {
  const resolutionAtEquator = map.getView().getResolution()
  if (resolutionAtEquator === undefined) return 0

  const projection = map.getView().getProjection()

  const resolutionAtLocation = getPointResolution(projection, resolutionAtEquator, center)
  const resolutionFactor = resolutionAtEquator / resolutionAtLocation
  const pixels = (meters / METERS_PER_UNIT.m) * resolutionFactor

  return pixels
}

/**
 * Exports the OpenLayers map instance to an image.
 *
 * TODO: Add Error messages for rejects
 *
 * @param map The OpenLayers map instance to export
 * @param size The desired size of the exported image
 * @param dpi The DPI (dots per inch) for the exported image
 * @param quality The quality of the exported image (0 to 1)
 * @returns A promise that resolves to the exported image data URL
 */
function exportMapToImage(
  map: Map,
  size: [number, number],
  dpi: number = 96,
  quality: number = 1,
  attribution?: { text: string; size: number },
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const mapSize = map.getSize()
    if (!mapSize || !mapSize[0] || !mapSize[1]) return reject()

    const viewResolution = map.getView().getResolution()
    if (!viewResolution) return reject()

    // Wait for the map to finish rendering
    map.once('rendercomplete', () => {
      // Convert the map to a canvas
      const canvas = _mapToCanvas(map)
      if (!canvas) return reject()

      // Draw attribution if provided
      if (attribution) _drawAttribution(canvas, attribution)

      // Take a snapshot of the map canvas
      const img = canvas.toDataURL('image/jpeg', quality)
      resolve(img)

      // Reset map to original state after export
      map.setSize(mapSize)
      map.getView().setResolution(viewResolution)
    })

    // Set print size
    const mmFromInch = 25.4
    const width = Math.round((size[0] * dpi) / mmFromInch)
    const height = Math.round((size[1] * dpi) / mmFromInch)
    map.setSize([width, height])

    const scale = width < height ? height / mapSize[0] : height / mapSize[1]
    map.getView().setResolution(viewResolution / scale)

    // Trigger a render to apply the new size and resolution
    map.renderSync()
  })
}

/**
 * Converts an OpenLayers map instance to an HTML canvas element.
 *
 * https://openlayers.org/en/latest/examples/export-map.html
 *
 * @param map The OpenLayers map instance to convert to a canvas
 * @returns The resulting HTML canvas element or undefined if conversion fails
 */
function _mapToCanvas(map: Map): HTMLCanvasElement | undefined {
  const mapCanvas = document.createElement('canvas')
  const mapContext = mapCanvas.getContext('2d')
  const size = map.getSize()

  if (!mapContext || !size || !size[0] || !size[1]) return

  mapCanvas.width = size[0]
  mapCanvas.height = size[1]

  Array.prototype.forEach.call(
    map.getViewport().querySelectorAll('.ol-layer canvas, canvas.ol-layer'),
    (canvas) => {
      if (canvas.width > 0) {
        const opacity = canvas.parentNode.style.opacity || canvas.style.opacity
        mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity)
        let matrix
        const transform = canvas.style.transform
        if (transform) {
          // Get the transform parameters from the style's transform matrix
          matrix = transform
            .match(/^matrix\(([^\(]*)\)$/)[1]
            .split(',')
            .map(Number)
        } else {
          matrix = [
            parseFloat(canvas.style.width) / canvas.width,
            0,
            0,
            parseFloat(canvas.style.height) / canvas.height,
            0,
            0,
          ]
        }
        // Apply the transform to the export map context
        CanvasRenderingContext2D.prototype.setTransform.apply(mapContext, matrix)
        const backgroundColor = canvas.parentNode.style.backgroundColor
        if (backgroundColor) {
          mapContext.fillStyle = backgroundColor
          mapContext.fillRect(0, 0, canvas.width, canvas.height)
        }
        mapContext.drawImage(canvas, 0, 0)
      }
    },
  )
  mapContext.globalAlpha = 1
  mapContext.setTransform(1, 0, 0, 1, 0, 0)

  return mapCanvas
}

/**
 * Draws the attribution text on the canvas.
 *
 * https://stackoverflow.com/a/18901408
 *
 * @param canvas The HTML canvas element to draw the attribution on
 * @param attribution The attribution text and font size
 */
function _drawAttribution(
  canvas: HTMLCanvasElement,
  attribution: { text: string; size: number },
): void {
  const context = canvas.getContext('2d')
  if (!context) return

  context.save()

  // Calculate layout
  context.font = attribution.size + 'px Open Sans'
  const margin = Math.round(attribution.size * 0.25)
  const textW = context.measureText(attribution.text).width
  const rectW = textW + 2 * margin
  const rectH = attribution.size + 2 * margin

  // Draw background rectangle
  context.fillStyle = 'rgba(255,255,255,0.75)'
  context.rect(canvas.width - rectW, canvas.height - rectH, rectW, rectH)
  context.fill()

  // Draw attribution text
  context.textAlign = 'right'
  context.textBaseline = 'top'
  context.fillStyle = '#333'
  context.fillText(attribution.text, canvas.width - margin, canvas.height - rectH + margin)

  context.restore()
}
