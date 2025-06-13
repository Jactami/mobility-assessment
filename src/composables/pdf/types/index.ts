export interface PdfConfig {
  format: [number, number] // [width, height] in mm
  padding: [number, number, number, number] // [top, right, bottom, left] in mm
  color?: Record<string, string>
  fontSize?: Record<string, number>
}

export interface PdfTextOptions {
  x: number
  y: number
  width?: number
  height?: number
  font?: string
  fontSize?: number
  color?: string
  alignment?: 'left' | 'center' | 'right'
  // TODO: Add more options like opacity, rotation, background color, etc.
}

export interface PdfImageOptions {
  x: number
  y: number
  width: number
  height: number
}
