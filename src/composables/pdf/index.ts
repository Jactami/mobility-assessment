import { useProjectStore } from '@/stores/Project'
import { ref } from 'vue'
import image from './assets/image'
import { config, fonts } from './config'
import { PdfReportBuilder } from './report/PdfReportBuilder'

export function usePdf() {
  const pdf = ref<Blob | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref<boolean>(false)

  const projectStore = useProjectStore()

  async function createPdf(data: unknown) {
    try {
      loading.value = true

      const meta = {
        title: `Standortbewertung - ${projectStore.project?.title}`,
        author: 'Bayerische Gesellschaft für Wohneigentum',
        date: new Date().toLocaleDateString(),
      }

      pdf.value = await new PdfReportBuilder(config, meta, fonts)
        .createHeader(`Standortbewertung - ${projectStore.project?.title}`)
        .createFooter('Bayerische Gesellschaft für Wohneigentum')
        .createPageHeader('Page Title', 'This is a subtitle')
        .createSectionHeader('Project data', { y: 40 })
        .printData(data, { y: 50, fontSize: 'sm' })
        .newPage()
        .createSectionHeader('Image Example')
        .createImage(image, { y: 20, width: 100, height: 100 })
        .createSeparatorPage('Anhang')
        .createDomainTables(projectStore.pois || [])
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
