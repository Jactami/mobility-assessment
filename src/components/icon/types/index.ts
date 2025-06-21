import LineMdLoadingTwotoneLoop from '~icons/line-md/loading-twotone-loop'
import MaterialSymbolsAddCircleOutline from '~icons/material-symbols/add-circle-outline'
import MaterialSymbolsArrowDropDownRounded from '~icons/material-symbols/arrow-drop-down-rounded'
import MaterialSymbolsArrowDropUpRounded from '~icons/material-symbols/arrow-drop-up-rounded'
import MaterialSymbolsCheckRounded from '~icons/material-symbols/check-rounded'
import MaterialSymbolsChevronLeft from '~icons/material-symbols/chevron-left-rounded'
import MaterialSymbolsChevronRight from '~icons/material-symbols/chevron-right'
import MaterialSymbolsCloseRounded from '~icons/material-symbols/close-rounded'
import MaterialSymbolsContentCopyOutlineRounded from '~icons/material-symbols/content-copy-outline-rounded'
import MaterialSymbolsDeleteOutlineRounded from '~icons/material-symbols/delete-outline-rounded'
import MaterialSymbolsEditRounded from '~icons/material-symbols/edit-rounded'
import MaterialSymbolsLogoutRounded from '~icons/material-symbols/logout-rounded'
import MaterialSymbolsMoreVert from '~icons/material-symbols/more-vert'
import MaterialSymbolsPerson from '~icons/material-symbols/person'
import MaterialSymbolsSearchRounded from '~icons/material-symbols/search-rounded'
import MaterialSymbolsVisibilityOffOutlineRounded from '~icons/material-symbols/visibility-off-outline-rounded'
import MaterialSymbolsVisibilityOutlineRounded from '~icons/material-symbols/visibility-outline-rounded'
import MdiChevronDoubleLeft from '~icons/mdi/chevron-double-left'
import MdiChevronDoubleRight from '~icons/mdi/chevron-double-right'
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
  clear: MaterialSymbolsCloseRounded,
  search: MaterialSymbolsSearchRounded,
  loading: LineMdLoadingTwotoneLoop,
  user: MaterialSymbolsPerson,
  close: MaterialSymbolsCloseRounded,
  up: MaterialSymbolsArrowDropUpRounded,
  down: MaterialSymbolsArrowDropDownRounded,
  next: MaterialSymbolsChevronRight,
  previous: MaterialSymbolsChevronLeft,
  first: MdiChevronDoubleLeft,
  last: MdiChevronDoubleRight,
  edit: MaterialSymbolsEditRounded,
}

export type Icon = keyof typeof iconMap
