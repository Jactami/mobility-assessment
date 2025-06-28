import type { Fonts, PdfConfig } from '../types'

export const config: PdfConfig = {
  format: {
    // Din A4
    width: 210,
    height: 297,
  },
  padding: {
    top: 25,
    right: 20,
    bottom: 25,
    left: 20,
  },
  color: {
    primary: '#3F51B5',
    text: '#020618',
    muted: '#6B7280',
    light: '#F5F5F5',
    neutral: '#FFF',
  },
  fontSize: {
    xs: 8,
    sm: 10,
    base: 14,
    lg: 18,
    xl: 24,
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
