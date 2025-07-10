import type { Poi, Project } from '@/db/types'
import i18n from '@/i18n'
import { merge } from '@pdfme/manipulator'
import { ref } from 'vue'
import { config, fonts } from './config'
import { PdfReportBuilder } from './report/PdfReportBuilder'

export function usePdf() {
  const pdf = ref<Uint8Array | null>(null)
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

      // Create the title page
      const pdfTitlePage = await new PdfReportBuilder(config, meta, fonts)
        .createTitlePage(project)
        .build()

      // Create the main body of the PDF
      const pdfBody = await new PdfReportBuilder(config, meta, fonts)
        // Set header and footer
        .createHeader(`Standortbewertung - ${project?.title}`, i18n.global.d(new Date()))
        .createFooter(
          `Bayerische Gesellschaft für Wohneigentum – Digital mbH & Co. KG © ${new Date().getFullYear()}`,
          1,
        )
        // Create Introduction section
        .createIntro(project)
        // Create summary page
        .newPage()
        .createSeparatorPage('Ergebnisübersicht')
        .newPage()
        .createSectionHeader('Gesamtbewertung des Mikrostandorts')
        .createScore(project.score ?? 0)
        // Create the Methodic section
        .newPage()
        .createSeparatorPage('Auswertung')
        .newPage()
        // Create appendix
        .createMethodic()
        .newPage()
        .createSeparatorPage('Anhang')
        .createDomainTables(pois)
        // Create legal notice page
        .newPage()
        .createSeparatorPage('Rechtliche Hinweise')
        .newPage()
        .createLegalNotice()
        .build()

      // Merge the title page and body into a single PDF
      pdf.value = await merge([pdfTitlePage, pdfBody])
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
