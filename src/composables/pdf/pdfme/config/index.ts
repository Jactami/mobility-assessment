import type { PdfConfig } from '../types'

export default {
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
} satisfies PdfConfig
