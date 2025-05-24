import MaterialSymbolsAddCircleOutline from '~icons/material-symbols/add-circle-outline'
import MaterialSymbolsCheckRounded from '~icons/material-symbols/check-rounded'
import MaterialSymbolsContentCopyOutlineRounded from '~icons/material-symbols/content-copy-outline-rounded'
import MaterialSymbolsDeleteOutlineRounded from '~icons/material-symbols/delete-outline-rounded'
import MaterialSymbolsLogoutRounded from '~icons/material-symbols/logout-rounded'
import MaterialSymbolsMoreVert from '~icons/material-symbols/more-vert'
import MaterialSymbolsVisibilityOffOutlineRounded from '~icons/material-symbols/visibility-off-outline-rounded'
import MaterialSymbolsVisibilityOutlineRounded from '~icons/material-symbols/visibility-outline-rounded'
import TablerExternalLink from '~icons/tabler/external-link'

export const iconMap = {
  link: TablerExternalLink,
  add: MaterialSymbolsAddCircleOutline,
  delete: MaterialSymbolsDeleteOutlineRounded,
  copy: MaterialSymbolsContentCopyOutlineRounded,
  check: MaterialSymbolsCheckRounded,
  signOut: MaterialSymbolsLogoutRounded,
  hide: MaterialSymbolsVisibilityOffOutlineRounded,
  show: MaterialSymbolsVisibilityOutlineRounded,
  more: MaterialSymbolsMoreVert,
}

export type Icon = keyof typeof iconMap
