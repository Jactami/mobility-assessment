<template>
  <div>
    <!-- Toolbar -->
    <div class="flex flex-col items-baseline gap-x-5 sm:flex-row sm:justify-between">
      <!-- Global Search -->
      <div v-if="config.searchable" class="w-full max-w-full sm:max-w-sm">
        <FormKit
          :id="filterId"
          v-model="globalFilter"
          type="text"
          name="search"
          :label="t('common.search')"
          label-class="sr-only"
          :placeholder="t('common.search')"
          autocomplete="off"
          :spellcheck="false"
        >
          <template #prefixIcon>
            <UIIcon icon="search" class="mr-2 text-on-surface-variant" />
          </template>
          <template #suffixIcon>
            <div class="relative w-6">
              <div class="absolute inset-y-0 -right-2 flex items-center">
                <UIButtonIcon
                  v-if="globalFilter"
                  icon="clear"
                  :aria-label="t('common.clear')"
                  @click="clearFilter"
                />
              </div>
            </div>
          </template>
        </FormKit>
      </div>

      <div class="flex gap-x-2 sm:ml-auto">
        <!-- Button Export -->
        <UIButton v-if="config.export" severity="neutral" icon="download" @click="exportData">
          {{ t('table.export') }}
        </UIButton>

        <!-- Button New -->
        <UIButton v-if="config.add" icon="add" @click="config.add">
          {{ t('action.add') }}
        </UIButton>
      </div>
    </div>

    <!-- Data Table -->
    <div class="mt-5 overflow-hidden rounded-border border border-outline-variant sm:mt-2">
      <div class="overflow-x-auto">
        <div class="inline-block min-w-full">
          <table class="relative min-w-full border-collapse text-sm">
            <!-- Table Head -->
            <thead class="border-b border-outline-variant">
              <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                <th
                  v-for="header in headerGroup.headers"
                  :key="header.id"
                  :colSpan="header.colSpan"
                  class="px-3 py-2.5 text-left"
                  :class="header.column.getCanSort() ? 'cursor-pointer select-none' : ''"
                  @click="header.column.getToggleSortingHandler()?.($event)"
                >
                  <div
                    v-if="!header.isPlaceholder"
                    class="flex items-center gap-1"
                    :class="[getAlignClass(header.column.id)]"
                  >
                    <FlexRender
                      v-if="!header.isPlaceholder"
                      :render="header.column.columnDef.header"
                      :props="header.getContext()"
                    />
                    <span v-if="header.column.getCanSort()" class="text-lg">
                      <UIIcon
                        icon="up"
                        class="-mb-3.5"
                        :class="
                          header.column.getIsSorted() === 'asc' ? 'opacity-100' : 'opacity-40'
                        "
                      />
                      <UIIcon
                        icon="down"
                        :class="
                          header.column.getIsSorted() === 'desc' ? 'opacity-100' : 'opacity-40'
                        "
                      />
                    </span>
                  </div>
                </th>
                <th v-if="config.actions" class="px-3 py-2.5 text-right">
                  <span class="sr-only">{{ t('table.actions') }}</span>
                </th>
              </tr>
            </thead>
            <!-- Table Body -->
            <tbody>
              <template v-if="table.getRowModel().rows.length === 0">
                <tr>
                  <td
                    :colspan="columns.length"
                    class="p-4 text-center text-sm text-on-surface-variant italic"
                  >
                    {{ t('table.empty') }}
                  </td>
                </tr>
              </template>

              <template v-else>
                <!-- Table Row -->
                <tr
                  v-for="row in table.getRowModel().rows"
                  :key="row.id"
                  class="odd:bg-surface-container-low hover:bg-surface-container"
                >
                  <!-- Table Cell -->
                  <td
                    v-for="cell in row.getVisibleCells()"
                    v-mark="config.searchable ? globalFilter : undefined"
                    :key="cell.id"
                    class="px-3 py-2.5 align-middle"
                    :style="`width: ${cell.column.columnDef.size}%`"
                  >
                    <div class="flex items-center" :class="[getAlignClass(cell.column.id)]">
                      <div>
                        <slot
                          :name="`column-${cell.column.id}`"
                          :row="cell.row.original"
                          :value="cell.getValue()"
                          :formatted="
                            getFormatter(cell.column.id)?.(cell.getValue(), cell.row.original) ??
                            cell.getValue()
                          "
                        >
                          <FlexRender
                            :render="cell.column.columnDef.cell"
                            :props="cell.getContext()"
                          />
                        </slot>
                      </div>
                    </div>
                  </td>
                  <!-- Table Row Actions -->
                  <td v-if="config.actions" class="px-1.5 text-right">
                    <div class="flex items-center gap-x-0.5 sm:gap-x-1">
                      <UITooltip
                        v-for="(action, i) in config.actions"
                        :key="i"
                        :message="action.label"
                      >
                        <UIButtonIcon
                          :icon="action.icon"
                          :title="action.label"
                          :severity="action.severity"
                          :disabled="action.disabled?.(row.original)"
                          @click="action.handler(row.original)"
                        />
                      </UITooltip>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="config.pagination && table.getPageCount() > 1" class="mt-2">
      <nav class="flex grow items-center justify-center gap-x-0 text-sm sm:gap-x-2">
        <UIButtonIcon
          icon="first"
          :aria-label="t('table.firstPage')"
          :disabled="!table.getCanPreviousPage()"
          @click="table.setPageIndex(0)"
        />
        <UIButtonIcon
          icon="previous"
          :aria-label="t('table.previousPage')"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        />
        <div class="px-2 text-center">
          <span class="hidden sm:inline-block">
            {{
              t('table.page', {
                current: table.getState().pagination.pageIndex + 1,
                total: table.getPageCount(),
              })
            }}&nbsp;
          </span>
          <span class="inline-block sm:hidden">
            {{ table.getState().pagination.pageIndex + 1 }} / {{ table.getPageCount() }}
          </span>
        </div>
        <UIButtonIcon
          icon="next"
          :aria-label="t('table.nextPage')"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        />
        <UIButtonIcon
          icon="last"
          :aria-label="t('table.lastPage')"
          :disabled="!table.getCanNextPage()"
          @click="table.setPageIndex(table.getPageCount() - 1)"
        />
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
import UIButton from '@/components/ui/button/UIButton.vue'
import UIButtonIcon from '@/components/ui/button/UIButtonIcon.vue'
import UIIcon from '@/components/ui/icon/UIIcon.vue'
import { useCSV } from '@/composables/csv'
import { useDownload } from '@/composables/download'
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
  type PaginationState,
  type SortingState,
} from '@tanstack/vue-table'
import { computed, ref, useId } from 'vue'
import { useI18n } from 'vue-i18n'
import UITooltip from '../ui/UITooltip.vue'
import type TableConfig from './types'
import type { ColumnAlign } from './types'

const props = defineProps<{
  /** Table setup (columns, sorting, pagination, etc.) */
  config: TableConfig<T>
  /** Array of rows to render in the table */
  data: T[]
}>()

const { t } = useI18n()
const { convertToCSV } = useCSV()
const { downloadCSV } = useDownload()

const filterId = `table-filter-${useId()}`

/** Current sorting state for the table */
const sorting = ref<SortingState>(
  props.config.presort
    ? [{ id: props.config.presort.key, desc: props.config.presort.order === 'desc' }]
    : [],
)

/** Pagination state, if enabled via config */
const pagination = ref<PaginationState | undefined>(
  // TODO: Decide if page size should be configurable
  props.config.pagination ? { pageIndex: 0, pageSize: 15 } : undefined,
)

/** Global filter string for search input */
const globalFilter = ref('')

const columnHelper = createColumnHelper<T>()

/** Transforms the column config into tanstack table column definitions */
const columns = computed(() => {
  return props.config.columns.map((col) => {
    return columnHelper.accessor((row: T) => row[col.key], {
      id: col.key,
      header: col.label,
      cell: (props) =>
        col.formatter ? col.formatter(props.getValue(), props.cell.row.original) : props.getValue(),
      enableSorting: !!col.sort,
      sortingFn: col.formatter
        ? (a, b) => {
            const rawA = a.getValue(col.key)
            const rawB = b.getValue(col.key)

            const aVal = col.sort === 'formatted' ? col.formatter?.(rawA, a.original) : rawA
            const bVal = col.sort === 'formatted' ? col.formatter?.(rawB, b.original) : rawB

            // Sort nullish values last (empty strings, null, undefined)
            if ((aVal == null || aVal === '') && (bVal == null || bVal === '')) return 0

            const isDesc = sorting.value?.find((s) => s.id === col.key)?.desc
            if (aVal == null || aVal === '') return isDesc ? -1 : 1
            if (bVal == null || bVal === '') return isDesc ? 1 : -1

            // Sort numbers
            if (typeof aVal === 'number' && typeof bVal === 'number') return aVal - bVal

            // Sort dates
            if (aVal instanceof Date && bVal instanceof Date) return aVal.getTime() - bVal.getTime()

            // Default alphanumeric sort
            return String(aVal).localeCompare(String(bVal))
          }
        : 'alphanumeric',
      enableGlobalFilter: props.config.searchable,
      size: col.width || 150, // Default width if not specified
    })
  })
})

/** Initializes the TanStack table instance with reactive state */
const table = useVueTable({
  get data() {
    return props.data
  },
  columns: columns.value,
  enableGlobalFilter: props.config.searchable,
  state: {
    get sorting() {
      return sorting.value
    },
    get globalFilter() {
      return globalFilter.value
    },
    get pagination() {
      return pagination.value
    },
  },
  onSortingChange: (updater) => {
    sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
  },
  onGlobalFilterChange: (updater) => {
    globalFilter.value = typeof updater === 'function' ? updater(globalFilter.value) : updater
  },
  onPaginationChange: (updater) => {
    if (!pagination.value) return
    pagination.value = typeof updater === 'function' ? updater(pagination.value) : updater
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: pagination.value ? getPaginationRowModel() : undefined,
  getColumnCanGlobalFilter: () => !!props.config.searchable,
  globalFilterFn: (row, columnId, filterValue) => {
    const raw = row.getValue(columnId)
    const colDef = props.config.columns.find((c) => c.key === columnId)
    const formatted = colDef?.formatter ? colDef.formatter(raw, row.original) : raw
    return String(formatted).toLowerCase().includes(filterValue.toLowerCase())
  },
})

/** Mapping of column keys to their definitions for easy access. */
const columnMap = computed(() => Object.fromEntries(props.config.columns.map((c) => [c.key, c])))

function getFormatter(columnId: string) {
  const col = columnMap.value[columnId]
  return col?.formatter
}

function getAlignClass(columnId: string) {
  const alignMap: Record<ColumnAlign, string> = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }

  const col = columnMap.value[columnId]
  return col?.align ? alignMap[col.align] : alignMap.left
}

function clearFilter() {
  globalFilter.value = ''

  const input = document.getElementById(filterId) as HTMLInputElement
  if (input) {
    input.focus()
    input.select()
  }
}

// TODO: Decide whether to export raw data or formatted data
function exportData() {
  if (!props.config.export) return

  // Formatted data export
  // const formattedData = props.data.map((row) => {
  //   const newRow: Record<string, unknown> = {}
  //   props.config.columns.forEach((col) => {
  //     const raw = row[col.key]
  //     newRow[col.label] = col.formatter ? col.formatter(raw, row) : raw
  //   })
  //   return newRow
  // })
  // const csv = convertToCSV(formattedData)

  // Raw data export
  const csv = convertToCSV(props.data)

  // Trigger download
  downloadCSV(csv, 'export.csv')
}
</script>
