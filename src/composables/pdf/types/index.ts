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
    light?: string
    // TODO: Add more colors if needed
  }
  fontSize: {
    xs?: number
    sm?: number
    base?: number
    lg?: number
    // TODO: Add more sizes if needed
  }
}

type FontKeys = 'regular' | 'bold'

// Intersect with Pick to restrict keys:
export type Fonts = {
  [K in FontKeys]?: Font[K]
}

export interface PdfTextOptions {
  x?: number
  y?: number
  width?: number
  height?: number
  font?: FontKeys
  fontSize?: keyof PdfConfig['fontSize']
  color?: keyof PdfConfig['color']
  alignment?: 'left' | 'center' | 'right'
  // TODO: Add more options like opacity, rotation, background color, etc.
}

export interface PdfImageOptions {
  x?: number
  y?: number
  width: number
  height: number
}

export interface PdfTableOptions {
  x?: number
  y?: number
  width?: number
  height?: number
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
