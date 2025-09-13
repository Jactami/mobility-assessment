import pdfDe from '@/composables/pdf/locales/de.yaml'
import { createI18n } from 'vue-i18n'
import de from './locales/de.json'

const messages = {
  de: {
    // Application messages (json)
    ...de,
    // PDF messages (yaml)
    ...pdfDe,
  },
}

type MessageSchema = typeof messages.de

export default createI18n<[MessageSchema], 'de'>({
  legacy: false,
  availableLocales: ['de'],
  locale: 'de',
  fallbackLocale: 'de',
  messages,
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
