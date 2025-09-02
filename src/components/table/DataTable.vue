<template>
  <div>
    <!-- Global Search -->
    <div v-if="config.searchable" class="mb-2 w-full max-w-sm">
      <FormKit
        v-model="globalFilter"
        type="text"
        name="search"
        :label="t('table.search')"
        :placeholder="t('table.searchPlaceholder')"
        autocomplete="off"
        :spellcheck="false"
      >
        <template #prefixIcon>
          <IconRenderer icon="search" class="mr-2 text-on-surface-variant" />
        </template>
        <template #suffixIcon>
          <div class="absolute right-0 bottom-1 flex items-center pr-2">
            <IconButton v-if="globalFilter" icon="clear" @click="globalFilter = ''" />
          </div>
        </template>
      </FormKit>
    </div>

    <!-- Data Table -->
    <div class="overflow-hidden rounded-border border border-outline-variant">
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
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
                <div v-if="!header.isPlaceholder" class="flex items-center gap-1">
                  <FlexRender
                    v-if="!header.isPlaceholder"
                    :render="header.column.columnDef.header"
                    :props="header.getContext()"
                  />
                  <span v-if="header.column.getCanSort()" class="text-lg">
                    <IconRenderer
                      icon="up"
                      class="-mb-3.5"
                      :class="header.column.getIsSorted() === 'asc' ? 'opacity-100' : 'opacity-40'"
                    />
                    <IconRenderer
                      icon="down"
                      :class="header.column.getIsSorted() === 'desc' ? 'opacity-100' : 'opacity-40'"
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
                  {{ t('table.noData') }}
                </td>
              </tr>
            </template>

            <template v-else>
              <tr
                v-for="row in table.getRowModel().rows"
                :key="row.id"
                class="odd:bg-surface-container-low hover:bg-surface-container"
              >
                <td
                  v-for="cell in row.getVisibleCells()"
                  :key="cell.id"
                  class="px-3 py-2.5 text-left"
                  :style="`width: ${cell.column.columnDef.size}%`"
                >
                  <slot :name="`item-${cell.column.id}`" :value="cell.getValue()">
                    <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                  </slot>
                </td>
                <td v-if="config.actions" class="px-2 text-right">
                  <div class="flex items-center gap-x-1">
                    <IconButton
                      v-for="(action, i) in config.actions"
                      :key="i"
                      :icon="action.icon"
                      :title="action.label"
                      @click="action.handler(row.original)"
                    />
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <div class="mt-2 flex items-center justify-between gap-x-6">
      <!-- Placeholder to balance add button -->
      <div v-if="config.add" class="w-10" />
      <!-- Pagination -->
      <div
        v-if="table.getPageCount() > 1"
        class="flex grow items-center justify-center gap-x-2 text-sm"
      >
        <IconButton
          icon="first"
          :disabled="!table.getCanPreviousPage()"
          @click="table.setPageIndex(0)"
        />
        <IconButton
          icon="previous"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        />
        <div class="px-2">
          {{ t('table.page') }} {{ table.getState().pagination.pageIndex + 1 }} /
          {{ table.getPageCount() }}
        </div>
        <IconButton icon="next" :disabled="!table.getCanNextPage()" @click="table.nextPage()" />
        <IconButton
          icon="last"
          :disabled="!table.getCanNextPage()"
          @click="table.setPageIndex(table.getPageCount() - 1)"
        />
      </div>

      <!-- Add new item button -->
      <div v-if="config.add" class="self-end">
        <BaseButton flavor="secondary" class="size-10 text-xl" @click="config.add">+</BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
import BaseButton from '@/components/base/BaseButton.vue'
import IconButton from '@/components/icon/IconButton.vue'
import IconRenderer from '@/components/icon/IconRenderer.vue'
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
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type TableConfig from './types'

/**
 * Props:
 * - config: Table setup (columns, sorting, pagination)
 * - data: Array of rows to render
 */
const props = defineProps<{
  /** Table setup (columns, sorting, pagination) */
  config: TableConfig<T>
  /** Array of rows to render in the table */
  data: T[]
}>()

const { t } = useI18n()

/** Current sorting state for the table */
const sorting = ref<SortingState>(
  props.config.presort
    ? [{ id: props.config.presort.key, desc: props.config.presort.order === 'desc' }]
    : [],
)

/** Pagination state, if enabled via config */
const pagination = ref<PaginationState | undefined>(
  // TODO: Decide if page size should be configurable
  props.config.pagination ? { pageIndex: 0, pageSize: 25 } : undefined,
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
      sortingFn:
        col.sort && col.formatter
          ? (a, b) => {
              const rawA = a.getValue(col.key)
              const rawB = b.getValue(col.key)

              const aVal = col.sort === 'formatted' ? col.formatter?.(rawA, a.original) : rawA
              const bVal = col.sort === 'formatted' ? col.formatter?.(rawB, b.original) : rawB

              // Sort numbers
              if (typeof aVal === 'number' && typeof bVal === 'number') return aVal - bVal

              // Sort dates
              if (aVal instanceof Date && bVal instanceof Date)
                return aVal.getTime() - bVal.getTime()

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
</script>
