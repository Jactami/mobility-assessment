import { useColorUtil } from '@/composables/util/color'
import { useUtil } from '@/composables/util/misc'
import { DOMAINS } from '@/constants'
import type { Poi, Project } from '@/db/types'
import i18n from '@/i18n'
import arrowDown from '../assets/arrow-down'
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
  createFooter(footer: string, pageOffset: number = 0): this {
    return this.createText(footer, {
      y: this._config.format.height - this._config.padding.bottom + 4,
      fontSize: 'sm',
      color: 'muted',
      alignment: 'left',
      static: true,
    })
      .createText(`{currentPage + ${pageOffset}}`, {
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
    const { createAddress } = useUtil()
    let address = createAddress({
      name: project?.name,
      street: project?.street,
      housenumber: project?.housenumber,
      postcode: project?.postcode,
      city: project?.city,
    })

    address = address.replace(/,\s+/g, ',\n')

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
   * Creates a section header for the PDF document, which includes a main header and an optional subheader.
   * @param header - The main header for the section.
   * @param options - Optional layout and styling options for the section header.
   * @returns The current instance of PdfReportBuilder for method chaining.
   */
  createSectionHeader(header: string, options?: PdfTextOptions): this {
    return this.createText(header, { font: 'bold', fontSize: 'lg', ...options })
  }

  /**
   * Creates a separator page in the PDF document.
   * @param title - The title for the separator page.
   * @returns The current instance of PdfReportBuilder for method chaining.
   */
  createSeparatorPage(title: string): this {
    const y = this._config.format.height * 0.25
    const h = 25

    return this.createRect({
      x: 0,
      y,
      width: this._config.format.width * 0.75,
      height: h,
      color: 'primary',
    }).createText(title, {
      y,
      height: h,
      fontSize: 'xl2',
      color: 'neutral',
      alignment: 'left',
      verticalAlignment: 'middle',
    })
  }

  createIntro(project: Project): this {
    const { createAddress } = useUtil()
    const address = createAddress({
      name: project?.name,
      street: project?.street,
      housenumber: project?.housenumber,
      postcode: project?.postcode,
      city: project?.city,
    })

    return this.createText(
      `Dieser Bericht dokumentiert die Ergebnisse der Standortbewertung für das Projekt ${address} im Umkreis von ${i18n.global.n(project.radius ?? Infinity, 'meter')}, basierend auf den vorliegenden Daten zum Stichtag ${i18n.global.d(new Date())}.\n\nZiel der Analyse ist es, die Stärken und Schwächen des Standorts transparent und nachvollziehbar darzustellen. Hierfür untersuchen wir den Standort aus verschiedenen Blickwinkeln hinsichtlich Nahversorgung, Mobilität, Freizeit, Gesundheit, Bildung und Naherholung. Auf dieser Grundlage vergeben wir eine Gesamtbewertung des Standorts von 0 bis 100 Punkten, wobei 100 Punkte einem optimalen Ergebnis entsprechen.\n\n\nDieser Bericht umfasst eine Übersicht zu den Ergebnissen, eine detaillierte Auswertung der Daten sowie eine Erläuterung der von uns angewandten Methodik.`,
    )
  }

  createScore(score: number): this {
    const { scoreToColor, scoreColorThresholds } = useColorUtil()

    const y = this._config.padding.top + 10

    // Score Box
    this.createRect({
      x: this._config.padding.left,
      y,
      width: this._config.format.width - this._config.padding.left - this._config.padding.right,
      height: 40,
      color: scoreToColor(score),
    })
      .createText(i18n.global.n(score * 100, 'rounded'), {
        y,
        height: 30,
        fontSize: 'xl5',
        color: 'neutral',
        alignment: 'center',
        verticalAlignment: 'middle',
      })
      .createText('Gesamtbewertung', {
        y: y + 25,
        height: 15,
        fontSize: 'xl2',
        color: 'neutral',
        alignment: 'center',
        verticalAlignment: 'middle',
      })

    // Score scale line
    this.createImage(arrowDown, {
      x:
        this._config.padding.left +
        (this._config.format.width - this._config.padding.left - this._config.padding.right) *
          score -
        10,
      y: y + 42,
      width: 20,
      height: 20,
    })

    let x = this._config.padding.left
    scoreColorThresholds.forEach((threshold, index) => {
      const range = threshold.max - (scoreColorThresholds[index - 1]?.max || 0)
      const width =
        (this._config.format.width - this._config.padding.left - this._config.padding.right) * range
      this.createRect({
        x,
        y: y + 55,
        width,
        height: 3,
        color: threshold.color,
      })
      x += width
    })

    this.createText('0', {
      x: this._config.padding.left,
      y: y + 58,
      fontSize: 'xs',
      color: 'muted',
      alignment: 'left',
    }).createText('100', {
      x: this._config.padding.left,
      y: y + 58,
      fontSize: 'xs',
      color: 'muted',
      alignment: 'right',
    })

    for (let i = 1; i < 10; i++) {
      const xPos =
        this._config.padding.left +
        (i * (this._config.format.width - this._config.padding.left - this._config.padding.right)) /
          10
      this.createText((i * 10).toString(), {
        x: xPos,
        y: y + 58,
        fontSize: 'xs',
        color: 'muted',
        alignment: 'left',
      })
    }

    return this
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
