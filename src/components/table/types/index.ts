import type { ButtonSeverity } from '@/components/ui/button/types'
import type { Icon } from '@/components/ui/icon/types'

export type ColumnAlign = 'left' | 'center' | 'right'

/**
 * Defines the structure of a column in a generic table component.
 * @template T - The type of the data of the table.
 */
export interface TableColumn<T> {
  /** The key in the data object used to access the column value.*/
  key: Extract<keyof T, string>

  /** Label for the column header. */
  label: string

  /** Optional sorting configuration for the column. If not provided, the column will not be sortable. */
  sort?: 'formatted' | 'raw'

  /** Optional formatter function to customize the cell value. */
  formatter?: (value: unknown, item: T) => unknown

  /** Optional width for the column. */
  width?: number

  /** Optional alignment for the column content. Defaults to 'left'. */
  align?: ColumnAlign
}

/**
 * Configuration object for the generic table component.
 * @template T - The type of the data of the table.
 */
export default interface TableConfig<T> {
  /** List of columns of the table. */
  columns: TableColumn<T>[]

  /** Enables pagination if true. */
  pagination?: boolean

  /** Enables a global search input if true. */
  searchable?: boolean

  /** Sorting configuration when the table is initially rendered. */
  presort?: {
    key: Extract<keyof T, string>
    order: 'asc' | 'desc'
  }

  /** Optional actions that can be performed on each row of the table. */
  actions?: {
    handler: (item: T) => unknown
    label: string
    icon: Icon
    severity?: ButtonSeverity
  }[]

  /** Optional action to handle adding a new item to the table. */
  add?: () => unknown

  /** Enables exporting the table data as a CSV file. */
  export?: boolean
}
