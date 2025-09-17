/**
 * Composable for downloading files.
 */
export function useDownload() {
  /**
   * Downloads a file.
   * @param content The content to download.
   * @param filename The name of the file.
   * @param mimeType The MIME type of the file.
   */
  function download(
    content: Blob | string,
    filename: string,
    mimeType = 'application/octet-stream',
  ) {
    // Create a Blob
    const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)

    // Create a temporary download link
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)

    // Trigger the download
    link.click()

    // Clean up
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  /**
   * Downloads a CSV file.
   * @param csv The CSV content to download.
   * @param filename The name of the file.
   */
  function downloadCSV(csv: string, filename: string): void {
    download(csv, filename, 'text/csv;charset=utf-8;')
  }

  /**
   * Downloads a PDF file.
   * @param pdf The PDF content to download.
   * @param filename The name of the file.
   */
  function downloadPDF(pdf: Blob, filename: string): void {
    download(pdf, filename, 'application/pdf')
  }

  return {
    download,
    downloadCSV,
    downloadPDF,
  }
}
