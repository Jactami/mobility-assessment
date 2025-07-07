import type { Project } from '@/db/types'
import { useProjectStore } from '@/stores/Project'
import { ref } from 'vue'
import { config, fonts } from './config'
import { PdfReportBuilder } from './report/PdfReportBuilder'

export function usePdf() {
  const pdf = ref<Blob | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref<boolean>(false)

  const projectStore = useProjectStore()

  async function createPdf(project: Project) {
    try {
      loading.value = true

      const meta = {
        title: `Standortbewertung - ${projectStore.project?.title}`,
        author: 'Bayerische Gesellschaft für Wohneigentum',
        date: new Date().toLocaleDateString(),
      }

      pdf.value = await new PdfReportBuilder(config, meta, fonts)
        .createTitlePage(project)
        .createFooter('Bayerische Gesellschaft für Wohneigentum')
        .newPage()
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
