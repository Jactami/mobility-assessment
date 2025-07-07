import type { Poi, Project } from '@/db/types'
import { ref } from 'vue'
import { config, fonts } from './config'
import { PdfReportBuilder } from './report/PdfReportBuilder'

export function usePdf() {
  const pdf = ref<Blob | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref<boolean>(false)

  async function createPdf(project: Project, pois: Poi[]) {
    try {
      loading.value = true

      const meta = {
        title: `Standortbewertung - ${project?.title}`,
        author: 'Bayerische Gesellschaft für Wohneigentum – Digital mbH & Co. KG',
        date: new Date().toLocaleDateString(),
      }

      pdf.value = await new PdfReportBuilder(config, meta, fonts)
        .createTitlePage(project)
        .createHeader(`Standortbewertung - ${project?.title}`)
        .createFooter('Bayerische Gesellschaft für Wohneigentum – Digital mbH & Co. KG')
        .newPage()
        .createSeparatorPage('Anhang')
        .createDomainTables(pois)
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
