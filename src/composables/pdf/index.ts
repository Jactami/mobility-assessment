import { ref } from 'vue'
import image from './assets/image'
import config from './config'
import { PdfReportBuilder } from './report/PdfReportBuilder'

export function usePdf() {
  const pdf = ref<Blob | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref<boolean>(false)

  async function createPdf() {
    try {
      loading.value = true

      pdf.value = await new PdfReportBuilder(config)
        .createText('Hello, World!', {
          x: 10,
          y: 10,
          fontSize: config.fontSize.lg,
          color: config.color?.primary,
          alignment: 'center',
        })
        .createText('This is a test PDF document.', { x: 10, y: 20 })
        .newPage()
        .createText('This is the second page.', { x: 10, y: 10 })
        .createImage(image, { x: 10, y: 30, width: 100, height: 100 })
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
