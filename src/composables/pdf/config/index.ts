import type { Font } from '@pdfme/common'
import type { PdfConfig } from '../types'

export const config: PdfConfig = {
  format: [210, 297], // Din A4
  padding: [10, 10, 10, 10],
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

export const fonts: Font = {
  regular: {
    data: '/fonts/Roboto-Regular.ttf',
    fallback: true,
  },
  bold: {
    data: '/fonts/Roboto-Bold.ttf',
  },
}
