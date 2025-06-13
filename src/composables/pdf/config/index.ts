import type { Fonts, PdfConfig } from '../types'

export const config: PdfConfig = {
  format: {
    // Din A4
    width: 210,
    height: 297,
  },
  padding: {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
  },
  color: {
    primary: '#3F51B5',
    text: '#020618',
  },
  fontSize: {
    sm: 10,
    base: 14,
    lg: 18,
  },
}

export const fonts: Fonts = {
  regular: {
    data: '/fonts/Roboto-Regular.ttf',
    fallback: true,
  },
  bold: {
    data: '/fonts/Roboto-Bold.ttf',
  },
}
