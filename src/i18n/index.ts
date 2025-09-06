import pdfDe from '@/composables/pdf/locales/de.yaml'
import { createI18n } from 'vue-i18n'
import de from './locales/de.json'

export default createI18n({
  legacy: false,
  locale: 'de',
  availableLocales: ['de'],
  messages: {
    de: {
      // Application messages (json)
      ...de,
      // PDF messages (yaml)
      ...pdfDe,
    },
  },
  numberFormats: {
    de: {
      meter: {
        style: 'unit',
        unit: 'meter',
        unitDisplay: 'short',
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      },
      rounded: {
        style: 'decimal',
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      },
    },
  },
})
