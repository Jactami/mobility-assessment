import { ref } from 'vue'
import { PdfBuilder } from './pdfme/PdfBuilder'

export function usePdf() {
  const pdf = ref<Blob | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref<boolean>(false)

  async function createPdf() {
    try {
      loading.value = true

      pdf.value = await new PdfBuilder()
        .createText('Hello, World!', { x: 10, y: 10 })
        .createText('This is a test PDF document.', { x: 10, y: 20 })
        .newPage()
        .createText('This is the second page.', { x: 10, y: 10 })
        .build()
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('An unknown error occurred')
    } finally {
      loading.value = false
    }
  }

  return {
    createPdf,
    pdf,
    error,
    loading,
  }
}
