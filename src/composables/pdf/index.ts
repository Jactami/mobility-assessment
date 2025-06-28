import { ref } from 'vue'
import image from './assets/image'
import { config, fonts } from './config'
import { PdfReportBuilder } from './report/PdfReportBuilder'

export function usePdf() {
  const pdf = ref<Blob | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref<boolean>(false)

  async function createPdf(data: unknown) {
    try {
      loading.value = true

      pdf.value = await new PdfReportBuilder(config, fonts)
        .createPageHeader('Page Title', 'This is a subtitle')
        .createSectionHeader('Project data', { y: 40 })
        .printData(data, { y: 50, fontSize: 'sm' })
        .newPage()
        .createSectionHeader('Image Example')
        .createImage(image, { y: 20, width: 100, height: 100 })
        .newPage()
        .createSectionHeader('Table Example')
        .createTable(
          ['Name', 'City', 'Description'],
          [
            ['Alice', 'New York', 'Alice is a freelance web designer and developer'],
            ['Bob', 'Paris', 'Bob is a freelance illustrator and graphic designer'],
            ['Charlie', 'London', 'Charlie is a freelance photographer'],
          ],
          {
            y: 20,
            border: true,
            padding: 2,
            head: { font: 'bold', fontSize: 'sm', color: 'primary' },
            body: { fontSize: 'xs' },
          },
        )
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
