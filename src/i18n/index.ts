import { createI18n } from 'vue-i18n'
import de from './locales/de.json'

export default createI18n({
  legacy: false,
  locale: 'de',
  availableLocales: ['de'],
  messages: { de },
  numberFormats: {
    de: {
      meter: {
        style: 'unit',
        unit: 'meter',
        unitDisplay: 'short',
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      },
    },
  },
})
