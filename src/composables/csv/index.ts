/**
 * Utility functions to work with CSV data.
 */
export function useCSV() {
  /**
   * Converts an array of objects to a CSV string.
   * @param data - Array of objects (e.g. [{ name: 'Anna' }])
   * @param options - Options for CSV conversion (e.g. { delimiter: ',' })
   */
  function convertToCSV(data: Record<string, unknown>[], options = { delimiter: ',' }): string {
    // Handle empty data
    if (!Array.isArray(data) || !data[0]) return ''

    // Extract headers
    const headers = Object.keys(data[0])

    // Convert rows to CSV format
    const rows = data.map((row) =>
      headers
        .map((header) => {
          const raw = row[header] ?? ''

          // Serialize arrays and objects
          const value =
            Array.isArray(raw) || typeof raw === 'object' ? JSON.stringify(raw) : String(raw)

          const escaped = value.replace(/"/g, '""')
          return `"${escaped}"`
        })
        .join(options.delimiter),
    )

    // Combine headers and rows
    return [headers.join(options.delimiter), ...rows].join('\n')
  }

  return { convertToCSV }
}
