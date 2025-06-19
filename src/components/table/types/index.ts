/**
 * Defines the structure of a column in a generic table component.
 * @template T - The type of the data of the table.
 *
 * TODO: Add more properties like alignments, widths, etc. as needed
 */
export interface TableColumn<T> {
  /** The key in the data object used to access the column value.*/
  key: Extract<keyof T, string>

  /** Label for the column header. */
  label: string

  /** If true, enables sorting for this column.*/
  sortable?: boolean

  /** Optional formatter function to customize the cell value. */
  formatter?: (value: unknown, item: T) => unknown
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
}
