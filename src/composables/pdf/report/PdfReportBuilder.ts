import type { EvaluationScores } from '@/composables/evaluation/types'
import { useLegal } from '@/composables/legal'
import { useColorUtil } from '@/composables/util/color'
import { useUtil } from '@/composables/util/misc'
import { useProjectUtil } from '@/composables/util/project'
import { DOMAINS } from '@/constants'
import type { Poi, Project } from '@/db/types'
import i18n from '@/i18n'
import type { AreaDomain } from '@/types'
import logoBgw from '../assets/logo-bgw'
import methodic from '../assets/methodic'
import { PdfBuilder } from '../core/PdfBuilder'
import type { PdfTextOptions } from '../types'

export class PdfReportBuilder extends PdfBuilder {
  // ==================== Basic Building Blocks =========================

  /**
   * Creates a header for the page.
   * @param header - The header text.
   * @returns The current instance of PdfReportBuilder for method chaining.
   */
  createHeader(headerLeft: string, headerRight: string): this {
    this.createText(headerLeft, {
      y: this._config.padding.top - 11,
      fontSize: 'sm',
      color: 'muted',
      alignment: 'left',
      static: true,
    })
    return this.createText(headerRight, {
      y: this._config.padding.top - 11,
      fontSize: 'sm',
      color: 'muted',
      alignment: 'right',
      static: true,
    }).createLine({
      x: this._config.padding.left,
      y: this._config.padding.top - 5,
      width: this._innerWidth,
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
      y: this._config.format.height - this._config.padding.bottom + 7,
      fontSize: 'sm',
      color: 'muted',
      alignment: 'left',
      static: true,
    })
      .createText(`{currentPage + ${pageOffset}}`, {
        y: this._config.format.height - this._config.padding.bottom + 7,
        fontSize: 'sm',
        color: 'muted',
        alignment: 'right',
        static: true,
      })
      .createLine({
        x: this._config.padding.left,
        y: this._config.format.height - this._config.padding.bottom + 5,
        width: this._innerWidth,
        height: 0.1,
        color: 'muted',
        static: true,
      })
  }

  /**
   * Creates a section header for the PDF document, which includes a main header and an optional subheader.
   * @param header - The main header for the section.
   * @param options - Optional layout and styling options for the section header.
   * @returns The current instance of PdfReportBuilder for method chaining.
   */
  createSectionHeader(header: string, options?: PdfTextOptions): this {
    return this.createText(header, { font: 'bold', fontSize: 'lg', color: 'primary', ...options })
  }

  /**
   * Creates a card element in the PDF report.
   * @param key The key for the card.
   * @param value The value for the card.
   * @param options The positioning and styling options for the card.
   * @returns The current instance of PdfReportBuilder for method chaining.
   */
  createCard(
    key: string,
    value: string,
    options: {
      x: number
      y: number
      width: number
      height: number
      color: string
    },
  ): this {
    return this.createRect({
      x: options.x,
      y: options.y,
      width: options.width,
      height: options.height,
      borderColor: options.color,
      borderWidth: 0.5,
      radius: 1,
    })
      .createText(value, {
        x: options.x,
        y: options.y,
        width: options.width,
        height: (options.height * 2) / 3,
        fontSize: 'xl2',
        font: 'bold',
        color: options.color,
        verticalAlignment: 'middle',
        alignment: 'center',
      })
      .createText(key, {
        x: options.x,
        y: options.y + (options.height * 2) / 3,
        width: options.width,
        height: options.height / 3,
        fontSize: 'sm',
        color: 'muted',
        verticalAlignment: 'middle',
        alignment: 'center',
      })
  }

  /**
   * Creates a score element in the PDF report.
   * @param score The score value (0-1).
   * @param label The label for the score.
   * @param y The vertical position for the score element.
   * @returns The current instance of PdfReportBuilder for method chaining.
   */
  createScoreMeter(score: number, label: string, y: number): this {
    const { scoreToColor } = useColorUtil()

    // Score Box
    this.createRect({
      x: this._config.padding.left,
      y,
      width: this._innerWidth,
      height: 40,
      color: scoreToColor(score),
      radius: 1,
    })
      .createText(i18n.global.n(score * 100, 'rounded'), {
        y,
        height: 30,
        font: 'bold',
        fontSize: 'xl5',
        color: 'neutral',
        alignment: 'center',
        verticalAlignment: 'middle',
      })
      .createText(label, {
        y: y + 25,
        height: 15,
        fontSize: 'xl',
        color: 'neutral',
        alignment: 'center',
        verticalAlignment: 'middle',
      })

    // Score scale line
    const lineY = y + 45
    const lineHeight = 3
    const lineRadius = 1

    this.createRect({
      x: this._config.padding.left,
      width: this._innerWidth,
      y: lineY,
      height: lineHeight,
      color: 'muted',
      radius: lineRadius,
    }).createRect({
      x: this._config.padding.left,
      y: lineY,
      width: this._innerWidth * score,
      height: lineHeight,
      color: scoreToColor(score),
      radius: lineRadius,
    })

    // Score scale labels
    for (let i = 0; i <= 10; i++) {
      const width = this._innerWidth / 10
      const x = this._config.padding.left + width * Math.max(i - 1, 0)

      this.createText((i * 10).toString(), {
        x: x + (i % 10 === 0 ? 0 : 0.5 * width), // center text except for first and last
        y: lineY + 4,
        width,
        fontSize: 'xs',
        color: 'muted',
        alignment: i === 0 ? 'left' : i === 10 ? 'right' : 'center',
      })
    }

    return this
  }

  createClosestPoisTable(pois: Poi[], domain: AreaDomain, y: number): this {
    const { getClosestPois, sortPoisByDistance, getPoisByDomain } = useProjectUtil()

    // Filter POIs that belong to the current domain's categories
    const domainPois = getPoisByDomain(pois, domain.name)

    // Abort if no POIs are found
    if (domainPois.length === 0) return this

    // Find the closest POI for each category
    let closestPois = getClosestPois(domainPois)

    // Sort the closest POIs by distance
    closestPois = sortPoisByDistance(closestPois)

    return this.createText(
      i18n.global.t('pdf.analysis.tableIntro', { domain: i18n.global.t(`domain.${domain.name}`) }),
      { y },
    ).createTable(
      [
        i18n.global.t('poi.category'),
        i18n.global.t('pdf.analysis.closestElement'),
        i18n.global.t('poi.distance'),
      ],
      closestPois.map((poi) => [
        i18n.global.t(`category.${poi.category}`),
        poi.label || i18n.global.t(`category.${poi.category}`),
        i18n.global.n(poi.distance, 'meter'),
      ]),
      {
        y: y + 10,
        border: false,
        padding: 2,
        columnWidths: [30, 50, 20],
        head: { font: 'bold', fontSize: 'sm' },
        body: { fontSize: 'xs' },
        stripedColor: 'light',
      },
    )
  }

  createDomainCards(pois: Poi[], domain: AreaDomain, y: number): this {
    const { getCategoriesByDomain, getPoisByCategory } = useProjectUtil()
    const categories = getCategoriesByDomain(domain.name)

    // Card configuration
    const padding = 2
    const cardsPerRow = 5
    const cardH = 20
    const CardW =
      (this._config.format.width -
        this._config.padding.left -
        this._config.padding.right -
        padding * (cardsPerRow - 1)) /
      cardsPerRow

    // Create cards for each category in the domain
    this.createText(
      i18n.global.t(`pdf.analysis.cardIntro`, { domain: i18n.global.t(`domain.${domain.name}`) }),
      { y },
    )
    categories?.forEach((category, i) => {
      const count = getPoisByCategory(pois, category).length
      this.createCard(i18n.global.t(`category.${category}`), count ? count.toString() : '-', {
        x: this._config.padding.left + (i % cardsPerRow) * (CardW + padding),
        y: y + 10 + Math.floor(i / cardsPerRow) * (cardH + padding),
        width: CardW,
        height: cardH,
        color: domain.color,
      })
    })

    return this
  }

  // ==================== Page Templates =========================

  /**
   * Creates a title page for the PDF document.
   * @param project - The project data used to create the title page.
   * @returns The current instance of PdfReportBuilder for method chaining.
   */
  createTitlePage(project: Project): this {
    const { createAddress } = useUtil()
    let address = createAddress({
      name: project?.name,
      street: project?.street,
      housenumber: project?.housenumber,
      postcode: project?.postcode,
      city: project?.city,
      country: project?.country,
    })

    address = address.replace(/,\s+/g, '\n')

    return (
      this.createText(i18n.global.t('pdf.title'), {
        y: this._config.padding.top + 10,
        alignment: 'center',
        fontSize: 'xl3',
        font: 'bold',
        color: 'primary',
      })
        .createText(project.title, {
          y: this._config.padding.top + 30,
          alignment: 'center',
          fontSize: 'xl2',
          font: 'bold',
          color: 'primary',
        })
        .createLine({
          x: this._config.padding.left,
          y: this._config.padding.top + 70,
          width: this._innerWidth,
          height: 1,
          color: 'primary',
        })
        .createText(i18n.global.t('pdf.subtitle'), {
          y: this._config.padding.top + 80,
          alignment: 'center',
          fontSize: 'xl',
        })
        .createText(address, {
          y: this._config.padding.top + 90,
          alignment: 'center',
          color: 'muted',
          fontSize: 'lg',
          height: 50,
          verticalAlignment: 'middle',
          lineHeight: 1.5,
        })
        // TODO: Decide if to use the creation Date or the current date
        .createText(`${i18n.global.t('pdf.date')}: ${i18n.global.d(new Date())}`, {
          y: this._config.padding.top + 140,
          alignment: 'center',
          color: 'muted',
        })
        .createLine({
          x: this._config.padding.left,
          y: this._config.padding.top + 155,
          width: this._innerWidth,
          height: 1,
          color: 'primary',
        })

        .createImage(logoBgw, {
          x: this._config.format.width / 2 - 40, // Center the logo
          y: this._config.padding.top + 165,
          width: 80,
          height: 80,
        })
        .createText(i18n.global.t('pdf.disclaimer'), {
          y: this._config.format.height - 10,
          alignment: 'center',
          fontSize: 'sm',
          color: 'muted',
          static: true,
        })
    )
  }

  /**
   * Creates a separator page in the PDF document.
   * @param title - The title for the separator page.
   * @returns The current instance of PdfReportBuilder for method chaining.
   */
  createSeparatorPage(title: string): this {
    const y = this._config.format.height * 0.25
    const h = 25

    // If we are not on the first page, create a new page
    if (this._page > 0) this.newPage()

    // Create separator page with title
    return this.createRect({
      x: -1, // avoid rounded corners on the right side
      y,
      width: this._config.format.width * 0.75,
      height: h,
      color: 'primary',
      radius: 1,
    })
      .createText(title, {
        y,
        height: h,
        fontSize: 'xl2',
        color: 'neutral',
        alignment: 'left',
        verticalAlignment: 'middle',
      })
      .newPage()
  }

  /**
   * Creates a summary section in the PDF document.
   * @param project - The project data used to create the summary.
   * @param chart - The base64 encoded image of the chart to be included in the summary.
   * @returns The current instance of PdfReportBuilder for method chaining.
   */
  createSummaryPage(project: Project, chart: string): this {
    const { createAddress } = useUtil()

    const address = createAddress({
      name: project?.name,
      street: project?.street,
      housenumber: project?.housenumber,
      postcode: project?.postcode,
      city: project?.city,
    })

    // Info about project details
    this.createSectionHeader(i18n.global.t('pdf.summary.microLocationTitle'))
      .createText(i18n.global.t('pdf.summary.microLocationText'), {
        y: this._config.padding.top + 10,
      })
      .createText(`${i18n.global.t('pdf.location')}:`, {
        y: this._config.padding.top + 30,
        font: 'bold',
      })
      .createText(address, {
        x: this._config.padding.left + 17,
        y: this._config.padding.top + 30,
      })
      .createText(`${i18n.global.t('pdf.radius')}:`, {
        y: this._config.padding.top + 36,
        font: 'bold',
      })
      .createText(`${i18n.global.n(project.radius ?? Infinity, 'meter')}`, {
        x: this._config.padding.left + 40,
        y: this._config.padding.top + 36,
      })
      .createText(`${i18n.global.t('pdf.date')}:`, {
        y: this._config.padding.top + 42,
        font: 'bold',
      })
      .createText(i18n.global.d(new Date()), {
        x: this._config.padding.left + 17,
        y: this._config.padding.top + 42,
      })

    // Project score
    this.createSectionHeader(i18n.global.t('pdf.summary.totalScoreTitle'), {
      y: this._config.padding.top + 60,
    })
      .createScoreMeter(
        project.score ?? 0,
        i18n.global.t('pdf.summary.totalScoreTitle'),
        this._config.padding.top + 70,
      )
      .createText(
        `${i18n.global.t('pdf.summary.totalScoreText', { score: i18n.global.n((project.score ?? 0) * 100, 'rounded') })}`,
        { y: this._config.padding.top + 130 },
      )

    // Single score
    this.createSectionHeader(i18n.global.t('pdf.summary.singleScoresTitle'), {
      y: this._config.padding.top + 150,
    })
      .createText(i18n.global.t('pdf.summary.singleScoresText'), {
        y: this._config.padding.top + 160,
      })
      .createImage(chart, {
        x: this._config.format.width / 2 - 38, // center chart
        y: this._config.padding.top + 170,
        width: 76,
        height: 76,
      })

    return this
  }

  /**
   * Creates the methodology page of the PDF report.
   * @returns The current instance of PdfReportBuilder for method chaining.
   */
  createMethodologyPage(): this {
    return this.createSectionHeader(i18n.global.t('pdf.methodology.title'))
      .createText(i18n.global.t('pdf.methodology.text1'), { y: this._config.padding.top + 10 })
      .createImage(methodic, {
        x: this._config.format.width / 2 - 55,
        y: this._config.padding.top + 50,
        width: 110,
        height: 110,
      })
      .createText(i18n.global.t('pdf.methodology.text2'), { y: this._config.padding.top + 170 })
  }

  /**
   * Creates a domain page in the PDF document.
   * @param pois - The list of points of interest (POIs) to include in the domain page.
   * @param scores - The evaluation scores for the domain.
   * @param maps - A record of map images for each domain.
   * @returns The current instance of PdfReportBuilder for method chaining.
   */
  createDomainPages(pois: Poi[], scores: EvaluationScores, maps: Record<string, string>): this {
    DOMAINS.forEach((domain, i) => {
      this.createSectionHeader(i18n.global.t(`domain.${domain.name}`))
        // Show description
        .createText(i18n.global.t(`pdf.analysis.description.${domain.name}`), {
          y: this._config.padding.top + 10,
        })
        // Show score evaluation
        .createScoreMeter(
          scores.domain[domain.name] ?? 0,
          `${i18n.global.t('pdf.analysis.score')} ${i18n.global.t(`domain.${domain.name}`)}`,
          this._config.padding.top + 35,
        )
        // Show map with POIs
        .createImage(maps[domain.name] ?? '', {
          x: this._config.padding.left,
          y: this._config.padding.top + 100,
          width: this._innerWidth,
          height: this._innerWidth * 0.75,
        })
        .createText(
          i18n.global.t('pdf.analysis.mapCaption', {
            domain: i18n.global.t(`domain.${domain.name}`),
          }),
          {
            y: this._config.padding.top + 100 + this._innerWidth * 0.75 + 2,
            fontSize: 'xs',
            color: 'muted',
            alignment: 'left',
          },
        )
        .newPage()
        // Create domain cards
        .createDomainCards(pois, domain, this._config.padding.top)
        // Create closest POIs table
        .createClosestPoisTable(pois, domain, this._config.padding.top + 90)

      // Create a new page after each domain section except the last one
      if (i < DOMAINS.length - 1) this.newPage()
    })

    return this
  }

  /**
   * Creates the legal notice page of the PDF report.
   * @returns The current instance of PdfReportBuilder for method chaining.
   */
  createLegalNoticePage(): this {
    return this.createSectionHeader(i18n.global.t('pdf.legal.title')).createText(
      i18n.global.t('pdf.legal.text'),
      { y: this._config.padding.top + 10 },
    )
  }

  /**
   * Creates the publisher page of the PDF report.
   * @returns The current instance of PdfReportBuilder for method chaining.
   */
  createPublisherPage(): this {
    const company = useLegal().getCompanyData()

    return (
      this.createSectionHeader(i18n.global.t('pdf.publisher.title'))
        .createText(i18n.global.t('pdf.publisher.text'), { y: this._config.padding.top + 10 })
        // About us section
        .createImage(logoBgw, {
          x: this._config.format.width / 2 - 40, // Center the logo
          y: this._config.padding.top + 90,
          width: 80,
          height: 80,
        })
        // Contact information
        .createSectionHeader(i18n.global.t('pdf.publisher.contactTitle'), {
          y: this._config.padding.top + 190,
          alignment: 'center',
        })
        .createText(
          i18n.global.t('pdf.publisher.contactText', {
            company: company.name,
            address: company.address,
            email: company.email,
            phone: company.phone,
            web: company.web,
          }),
          { y: this._config.padding.top + 200, lineHeight: 1.5, alignment: 'center' },
        )
    )
  }

  /**
   * Creates domain tables for the PDF document.
   * @param pois - The list of Points of Interest (POIs) to be categorized and displayed in domain tables.
   * @returns The current instance of PdfReportBuilder for method chaining.
   */
  createDomainTables(pois: Poi[]): this {
    const { getPoisByDomain, sortPoisByDistance } = useProjectUtil()

    DOMAINS.forEach((domain, i) => {
      // Filter POIs that belong to the current domain's categories
      let domainPois = getPoisByDomain(pois, domain.name)

      // Sort the POIs by distance
      domainPois = sortPoisByDistance(domainPois)

      this.createSectionHeader(i18n.global.t(`domain.${domain.name}`))

      if (domainPois.length > 0) {
        // Show POIs in a table
        this.createTable(
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
      } else {
        // Show a message if no POIs are found
        this.createText(i18n.global.t('pdf.appendix.noEntries', { domain: domain.name }), {
          y: this._config.padding.top + 10,
          alignment: 'left',
          color: 'muted',
          fontSize: 'sm',
        })
      }

      // Start a new page after each domain table except the last one
      if (i < DOMAINS.length - 1) this.newPage()
    })

    return this
  }
}
