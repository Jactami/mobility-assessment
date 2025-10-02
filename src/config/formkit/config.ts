import { createAutoAnimatePlugin } from '@formkit/addons'
import { de } from '@formkit/i18n'
import { genesisIcons } from '@formkit/icons'
import type { DefaultConfigOptions } from '@formkit/vue'
import { rootClasses } from './theme'

export default {
  locales: { de },
  locale: 'de',
  config: {
    // theme editor: https://themes.formkit.com/editor
    rootClasses,
  },
  plugins: [
    // https://formkit.com/plugins/auto-animate
    createAutoAnimatePlugin(),
  ],
  icons: {
    ...genesisIcons,
  },
} satisfies DefaultConfigOptions
