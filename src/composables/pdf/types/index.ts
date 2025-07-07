import type { Font } from '@pdfme/common'

export interface PdfConfig {
  format: {
    width: number // in mm
    height: number // in mm
  }
  padding: {
    top: number // in mm
    right: number // in mm
    bottom: number // in mm
    left: number // in mm
  }
  color: {
    primary: string
    text: string
    muted?: string
    light?: string
    neutral?: string
    // TODO: Add more colors if needed
  }
  fontSize: {
    xs?: number
    sm?: number
    base?: number
    lg?: number
    xl?: number
    xl2?: number
    xl3?: number
    xl4?: number
    xl5?: number
    xl6?: number
    xl7?: number
    // TODO: Add more sizes if needed
  }
}

type FontKeys = 'regular' | 'bold'

// Intersect with Pick to restrict keys:
export type Fonts = {
  [K in FontKeys]?: Font[K]
}

export interface PdfElementOptions {
  x?: number
  y?: number
  width?: number
  height?: number
  static?: boolean // whether the element is static (not affected by dynamic input)
}

export interface PdfTextOptions extends PdfElementOptions {
  font?: FontKeys
  fontSize?: keyof PdfConfig['fontSize']
  color?: keyof PdfConfig['color']
  lineHeight?: number
  alignment?: 'left' | 'center' | 'right'
  verticalAlignment?: 'top' | 'middle' | 'bottom'
  // TODO: Add more options like opacity, rotation, background color, etc.
}

export interface PdfImageOptions extends PdfElementOptions {
  width: number
  height: number
}

export interface PdfLineOptions extends PdfElementOptions {
  x: number
  y: number
  width: number
  height: number
  color?: keyof PdfConfig['color']
}

export interface PdfRectOptions extends PdfElementOptions {
  x: number
  y: number
  width: number
  height: number
  color?: keyof PdfConfig['color']
}

export interface PdfTableOptions extends PdfElementOptions {
  columnWidths?: number[]
  showHead?: boolean
  padding?: number // in mm
  border?: boolean // whether to show borders
  stripedColor?: string // set to a color to enable striped rows
  head?: PdfTableStyleOptions
  body?: PdfTableStyleOptions
}

interface PdfTableStyleOptions {
  font?: FontKeys
  fontSize?: keyof PdfConfig['fontSize']
  color?: keyof PdfConfig['color']
}
