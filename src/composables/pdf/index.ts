import { ref } from 'vue'
import image from './assets/image'
import { config, fonts } from './config'
import { PdfReportBuilder } from './report/PdfReportBuilder'

export function usePdf() {
  const pdf = ref<Blob | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref<boolean>(false)

  async function createPdf() {
    try {
      loading.value = true

      pdf.value = await new PdfReportBuilder(config, fonts)
        .createText('Hello, World!', {
          fontSize: 'lg',
          color: 'primary',
          alignment: 'center',
          font: 'bold',
        })
        .createText('This is a test PDF document.', { y: 20 })
        .newPage()
        .createText('This is the second page.', { y: 10 })
        .createImage(image, { y: 30, width: 100, height: 100 })
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
