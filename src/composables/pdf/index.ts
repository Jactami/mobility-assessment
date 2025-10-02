import type { EvaluationScores } from '@/composables/evaluation/types'
import { useLegal } from '@/composables/legal'
import type { Poi, Project } from '@/db/types'
import { merge } from '@pdfme/manipulator'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { config, fonts } from './config'
import { PdfReportBuilder } from './report/PdfReportBuilder'

export function usePDF() {
  const pdf = ref<Uint8Array | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref<boolean>(false)

  const { t } = useI18n()

  /**
   * Helper to build a PDF using the provided function.
   * @param buildFn Function that builds the PDF and returns a promise that resolves to a Uint8Array.
   */
  async function buildPdf(buildFn: () => Promise<Uint8Array>) {
    try {
      // Reset state
      pdf.value = null
      error.value = null

      // Generate PDF
      loading.value = true
      pdf.value = await buildFn()
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Unknown error.')
    } finally {
      loading.value = false
    }
  }

  /**
   * Creates evaluation report for the given project
   * @param data - Data to create the report, including project, points of interest, scores, chart data, and maps.
   * @returns A promise that resolves to the generated PDF as a Uint8Array.
   */
  function createReport(data: {
    project: Project
    pois: Poi[]
    scores: EvaluationScores
    chart: string
    maps: Record<string, string>
  }) {
    const company = useLegal().getCompanyData()

    const buildReport = async () => {
      // Create metadata for the PDF
      const meta = {
        title: t('pdf.title', { title: data.project?.title }),
        author: t('pdf.author', { company: company.name }),
        date: new Date().toLocaleDateString(),
      }

      // Create the title page
      const pdfTitlePage = await new PdfReportBuilder(config, meta, fonts)
        .createTitlePage(data.project)
        .build()

      // Create the main body of the PDF
      const pdfBody = await new PdfReportBuilder(config, meta, fonts)
        // Set header and footer
        .createHeader(
          t('pdf.header.left', { title: data.project?.title }),
          t('pdf.header.right', { date: new Date().toLocaleDateString() }),
        )
        .createFooter(
          t('pdf.footer.left', { company: company.name, year: new Date().getFullYear() }),
          1,
        )
        // Create summary page
        .createSeparatorPage(t('pdf.section.summary'))
        .createSummaryPage(data.project, data.chart)
        // Create the methodic section
        .createSeparatorPage(t('pdf.section.methodology'))
        // Create methodic overview
        .createMethodologyPage()
        // Create factor specific sections
        .newPage()
        .createFactorPages(data.pois, data.scores, data.maps)
        // Create about us section
        .createSeparatorPage(t('pdf.section.publisher'))
        .createPublisherPage()
        // Create appendix
        .createSeparatorPage(t('pdf.section.appendix'))
        .createFactorTables(data.pois)
        // Create legal notice page
        .createSeparatorPage(t('pdf.section.legal'))
        .createLegalNoticePage()
        .build()

      // Merge the title page and body into a single PDF
      const pdf = await merge([pdfTitlePage, pdfBody])
      return pdf
    }

    return buildPdf(buildReport)
  }

  return {
    createReport,
    pdf,
    error,
    loading,
  }
}
