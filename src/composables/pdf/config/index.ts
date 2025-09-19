import type { Fonts, PdfConfig } from '../types'
import robotoBold from './../assets/fonts/Roboto-Bold.ttf?url'
import robotoRegular from './../assets/fonts/Roboto-Regular.ttf?url'

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
    primary: '#367588',
    text: '#020618',
    muted: '#6B7280',
    light: '#E5E5E5',
    neutral: '#FFF',
  },
  fontSize: {
    xs: 8,
    sm: 9,
    base: 11,
    lg: 14,
    xl: 18,
    xl2: 24,
    xl3: 32,
    xl4: 40,
    xl5: 48,
    xl6: 56,
    xl7: 64,
  },
  alignment: 'justify',
}

export const fonts: Fonts = {
  regular: {
    data: robotoRegular,
    fallback: true,
  },
  bold: {
    data: robotoBold,
  },
}
