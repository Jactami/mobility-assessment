import type { EvaluationScores } from '@/composables/evaluation/types'
import { useLegal } from '@/composables/legal'
import type { Poi, Project } from '@/db/types'
import { merge } from '@pdfme/manipulator'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { config, fonts } from './config'
import { PdfReportBuilder } from './report/PdfReportBuilder'

export function usePdf() {
  const pdf = ref<Uint8Array | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref<boolean>(false)

  const { t } = useI18n()
  const company = useLegal().getCompanyData()

  async function createPdf(data: {
    project: Project
    pois: Poi[]
    scores: EvaluationScores
    chart: string
    maps: Record<string, string>
  }) {
    try {
      loading.value = true

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
        .createSummary(data.project, data.chart)
        // Create the methodic section
        .createSeparatorPage(t('pdf.section.methodology'))
        // Create methodic overview
        .createMethodic()
        // Create domain specific sections
        .newPage()
        .createDomainPage(data.pois, data.scores, data.maps)
        // Create about us section
        .createSeparatorPage(t('pdf.section.publisher'))
        .createAboutUs()
        // Create appendix
        .createSeparatorPage(t('pdf.section.appendix'))
        .createDomainTables(data.pois)
        // Create legal notice page
        .createSeparatorPage(t('pdf.section.legal'))
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
