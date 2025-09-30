import type { FunctionalComponent } from 'vue'
import LineMdLoadingTwotoneLoop from '~icons/line-md/loading-twotone-loop'
import MaterialSymbolsAdd2Rounded from '~icons/material-symbols/add-2-rounded'
import MaterialSymbolsArrowDropDownRounded from '~icons/material-symbols/arrow-drop-down-rounded'
import MaterialSymbolsArrowDropUpRounded from '~icons/material-symbols/arrow-drop-up-rounded'
import MaterialSymbolsBarChartRounded from '~icons/material-symbols/bar-chart-rounded'
import MaterialSymbolsCheckRounded from '~icons/material-symbols/check-rounded'
import MaterialSymbolsChevronLeft from '~icons/material-symbols/chevron-left-rounded'
import MaterialSymbolsChevronRight from '~icons/material-symbols/chevron-right'
import MaterialSymbolsCloseRounded from '~icons/material-symbols/close-rounded'
import MaterialSymbolsContentCopyOutlineRounded from '~icons/material-symbols/content-copy-outline-rounded'
import MaterialSymbolsDarkModeRounded from '~icons/material-symbols/dark-mode-rounded'
import MaterialSymbolsDeleteOutlineRounded from '~icons/material-symbols/delete-outline-rounded'
import MaterialSymbolsDownload from '~icons/material-symbols/download'
import MaterialSymbolsEditRounded from '~icons/material-symbols/edit-rounded'
import MaterialSymbolsErrorOutlineRounded from '~icons/material-symbols/error-outline-rounded'
import MaterialSymbolsHome from '~icons/material-symbols/home'
import MaterialSymbolsLocationOnRounded from '~icons/material-symbols/location-on-rounded'
import MaterialSymbolsLoginRounded from '~icons/material-symbols/login-rounded'
import MaterialSymbolsLogoutRounded from '~icons/material-symbols/logout-rounded'
import MaterialSymbolsMapOutlineRounded from '~icons/material-symbols/map-outline-rounded'
import MaterialSymbolsMoreVert from '~icons/material-symbols/more-vert'
import MaterialSymbolsPerson from '~icons/material-symbols/person'
import MaterialSymbolsRefreshRounded from '~icons/material-symbols/refresh-rounded'
import MaterialSymbolsSaveOutlineRounded from '~icons/material-symbols/save-outline-rounded'
import MaterialSymbolsSearchRounded from '~icons/material-symbols/search-rounded'
import MaterialSymbolsSettings from '~icons/material-symbols/settings'
import MaterialSymbolsStarOutlineRounded from '~icons/material-symbols/star-outline-rounded'
import MaterialSymbolsStarRounded from '~icons/material-symbols/star-rounded'
import MaterialSymbolsSunnyRounded from '~icons/material-symbols/sunny-rounded'
import MaterialSymbolsVisibilityOffOutlineRounded from '~icons/material-symbols/visibility-off-outline-rounded'
import MaterialSymbolsVisibilityOutlineRounded from '~icons/material-symbols/visibility-outline-rounded'
import MdiChevronDoubleLeft from '~icons/mdi/chevron-double-left'
import MdiChevronDoubleRight from '~icons/mdi/chevron-double-right'
import MdiFilePdfOutline from '~icons/mdi/file-pdf-outline'
import TablerArrowBackUp from '~icons/tabler/arrow-back-up'
import TablerExternalLink from '~icons/tabler/external-link'

/**
 * Mapping of icon names to their respective components.
 */
export const icons = {
  add: MaterialSymbolsAdd2Rounded,
  back: TablerArrowBackUp,
  check: MaterialSymbolsCheckRounded,
  clear: MaterialSymbolsCloseRounded,
  close: MaterialSymbolsCloseRounded,
  copy: MaterialSymbolsContentCopyOutlineRounded,
  dark: MaterialSymbolsDarkModeRounded,
  delete: MaterialSymbolsDeleteOutlineRounded,
  down: MaterialSymbolsArrowDropDownRounded,
  download: MaterialSymbolsDownload,
  edit: MaterialSymbolsEditRounded,
  error: MaterialSymbolsErrorOutlineRounded,
  evaluation: MaterialSymbolsBarChartRounded,
  favorite: MaterialSymbolsStarRounded,
  first: MdiChevronDoubleLeft,
  hide: MaterialSymbolsVisibilityOffOutlineRounded,
  home: MaterialSymbolsHome,
  last: MdiChevronDoubleRight,
  light: MaterialSymbolsSunnyRounded,
  link: TablerExternalLink,
  loading: LineMdLoadingTwotoneLoop,
  map: MaterialSymbolsMapOutlineRounded,
  more: MaterialSymbolsMoreVert,
  next: MaterialSymbolsChevronRight,
  noFavorite: MaterialSymbolsStarOutlineRounded,
  poi: MaterialSymbolsLocationOnRounded,
  previous: MaterialSymbolsChevronLeft,
  refresh: MaterialSymbolsRefreshRounded,
  report: MdiFilePdfOutline,
  save: MaterialSymbolsSaveOutlineRounded,
  search: MaterialSymbolsSearchRounded,
  settings: MaterialSymbolsSettings,
  signIn: MaterialSymbolsLoginRounded,
  signOut: MaterialSymbolsLogoutRounded,
  show: MaterialSymbolsVisibilityOutlineRounded,
  up: MaterialSymbolsArrowDropUpRounded,
  user: MaterialSymbolsPerson,
} satisfies Record<string, FunctionalComponent>

/**
 * Valid icon names.
 */
export type Icon = keyof typeof icons
