import { DOMAINS } from '@/constants'
import type { Poi, Project } from '@/db/types'
import i18n from '@/i18n'
import logoBgw from '../assets/logo-bgw'
import { PdfBuilder } from '../core/PdfBuilder'
import type { PdfTextOptions } from '../types'

export class PdfReportBuilder extends PdfBuilder {
  /**
   * Creates a header for the page.
   * @param header - The header text.
   * @returns The current instance of PdfReportBuilder for method chaining.
   */
  createHeader(header: string): this {
    return this.createText(header, {
      y: this._config.padding.top - 8,
      fontSize: 'sm',
      color: 'muted',
      alignment: 'left',
      static: true,
    }).createLine({
      x: this._config.padding.left,
      y: this._config.padding.top - 2,
      width: this._config.format.width - this._config.padding.left - this._config.padding.right,
      height: 0.1,
      color: 'muted',
      static: true,
    })
  }

  /**
   * Creates a footer for the page.
   * @param footer - The footer text.
   * @returns The current instance of PdfReportBuilder for method chaining.
   */
  createFooter(footer: string): this {
    return this.createText(footer, {
      y: this._config.format.height - this._config.padding.bottom + 4,
      fontSize: 'sm',
      color: 'muted',
      alignment: 'left',
      static: true,
    })
      .createText('{currentPage}', {
        y: this._config.format.height - this._config.padding.bottom + 4,
        fontSize: 'sm',
        color: 'muted',
        alignment: 'right',
        static: true,
      })
      .createLine({
        x: this._config.padding.left,
        y: this._config.format.height - this._config.padding.bottom + 2,
        width: this._config.format.width - this._config.padding.left - this._config.padding.right,
        height: 0.1,
        color: 'muted',
        static: true,
      })
  }

  createTitlePage(project: Project): this {
    let address = ''
    address += project?.name ? project?.name + ',\n' : ''
    address += project?.street ? project?.street : ''
    address += project?.housenumber ? ' ' + project?.housenumber + ',\n' : '\n'
    address += project?.postcode ? project?.postcode + ' ' : ''
    address += project?.city ? project?.city : ''

    return (
      this.createText('Standortbewertung', {
        y: this._config.padding.top + 10,
        alignment: 'center',
        fontSize: 'xl3',
        font: 'bold',
      })
        .createText(project.title, {
          y: this._config.padding.top + 30,
          alignment: 'center',
          fontSize: 'xl2',
        })
        .createLine({
          x: this._config.padding.left,
          y: this._config.padding.top + 60,
          width: this._config.format.width - this._config.padding.left - this._config.padding.right,
          height: 1,
          color: 'primary',
        })
        .createText('Ergebnisbericht der Standortanalyse', {
          y: this._config.padding.top + 70,
          alignment: 'center',
          fontSize: 'xl',
        })
        .createText(address, {
          y: this._config.padding.top + 90,
          alignment: 'center',
          fontSize: 'lg',
          color: 'muted',
          lineHeight: 1.5,
        })
        .createLine({
          x: this._config.padding.left,
          y: this._config.padding.top + 115,
          width: this._config.format.width - this._config.padding.left - this._config.padding.right,
          height: 1,
          color: 'primary',
        })
        // TODO: Decide if to use the creation Date or the current date
        .createText(`Stichtag: ${i18n.global.d(new Date())}`, {
          y: this._config.padding.top + 130,
        })
        .createText(`Untersuchter Umkreis: ${i18n.global.n(project.radius ?? Infinity, 'meter')}`, {
          y: this._config.padding.top + 140,
        })
        .createImage(logoBgw, {
          x: this._config.format.width / 2 - 40, // Center the logo
          y: this._config.padding.top + 165,
          width: 80,
          height: 80,
        })
        .createText(
          'Dieser Bericht ist vertraulich und ausschließlich für den Empfänger bestimmt.',
          {
            y: this._config.format.height - this._config.padding.bottom - 5,
            alignment: 'center',
            fontSize: 'sm',
            color: 'muted',
          },
        )
    )
  }

  /**
   * Creates a header for the page, which includes a main header and an optional subheader.
   * @param header - The main header for the page.
   * @param subheader - The subheader for the page (optional).
   * @returns The current instance of PdfReportBuilder for method chaining.
   */
  createPageHeader(header: string, subheader?: string): this {
    if (subheader) {
      this.createText(subheader, {
        alignment: 'center',
        font: 'bold',
        y: this._config.padding.top + 10,
      })
    }

    return this.createText(header, {
      fontSize: 'lg',
      color: 'primary',
      alignment: 'center',
      font: 'bold',
    })
  }

  /**
   * Creates a section header for the PDF document, which includes a main header and an optional subheader.
   * @param header - The main header for the section.
   * @param options - Optional layout and styling options for the section header.
   * @returns The current instance of PdfReportBuilder for method chaining.
   */
  createSectionHeader(header: string, options?: PdfTextOptions): this {
    return this.createText(header, { font: 'bold', ...options })
  }

  /**
   * Creates a separator page in the PDF document.
   * @param title - The title for the separator page.
   * @returns The current instance of PdfReportBuilder for method chaining.
   */
  createSeparatorPage(title: string): this {
    const y = this._config.format.height * 0.25
    const h = 25

    return this.newPage()
      .createRect({
        x: 0,
        y,
        width: this._config.format.width * 0.75,
        height: h,
        color: 'primary',
      })
      .createText(title, {
        y,
        height: h,
        fontSize: 'xl',
        color: 'neutral',
        alignment: 'left',
        verticalAlignment: 'middle',
      })
  }

  /**
   * Creates domain tables for the PDF document.
   *
   * TODO: Decide if the POIs should be processed in the composable or here.
   *
   * @param pois - The list of Points of Interest (POIs) to be categorized and displayed in domain tables.
   * @returns The current instance of PdfReportBuilder for method chaining.
   */
  createDomainTables(pois: Poi[]): this {
    DOMAINS.forEach((domain) => {
      // Filter POIs that belong to the current domain's categories
      const domainCategories = domain.categories.map((category) => category.name)
      const domainPois = pois.filter(
        (poi) => poi.category && domainCategories.includes(poi.category),
      )

      // Sort the POIs by distance
      domainPois.sort((a, b) => (a.distance || 0) - (b.distance || 0))

      // Create a new page for each domain
      this.newPage()
        .createSectionHeader(i18n.global.t(`domain.${domain.name}`))
        .createTable(
          [
            i18n.global.t('poi.label'),
            i18n.global.t('poi.category'),
            i18n.global.t('poi.distance'),
          ],
          domainPois.map((poi) => [
            poi.label || i18n.global.t(`category.${poi.category}`),
            i18n.global.t(`category.${poi.category}`),
            i18n.global.n(poi.distance, 'meter'),
          ]),
          {
            y: this._config.padding.top + 10,
            border: false,
            padding: 2,
            columnWidths: [50, 30, 20],
            head: { font: 'bold', fontSize: 'sm' },
            body: { fontSize: 'xs' },
            stripedColor: this._config.color.light,
          },
        )
    })

    return this
  }
}
