import type { EvaluationScores } from '@/composables/evaluation/types'
import { useLegal } from '@/composables/legal'
import { useColorUtil } from '@/composables/util/color'
import { useUtil } from '@/composables/util/misc'
import { DOMAINS } from '@/constants'
import type { Poi, Project } from '@/db/types'
import i18n from '@/i18n'
import logoBgw from '../assets/logo-bgw'
import methodic from '../assets/methodic'
import { PdfBuilder } from '../core/PdfBuilder'
import type { PdfTextOptions } from '../types'

export class PdfReportBuilder extends PdfBuilder {
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
      country: project?.country,
    })

    address = address.replace(/,\s+/g, '\n')

    return (
      this.createText('Standortbewertung', {
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
          width: this._config.format.width - this._config.padding.left - this._config.padding.right,
          height: 1,
          color: 'primary',
        })
        .createText('Ergebnisbericht der Standortanalyse', {
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
        .createText(`Stichtag: ${i18n.global.d(new Date())}`, {
          y: this._config.padding.top + 140,
          alignment: 'center',
          color: 'muted',
        })
        .createLine({
          x: this._config.padding.left,
          y: this._config.padding.top + 155,
          width: this._config.format.width - this._config.padding.left - this._config.padding.right,
          height: 1,
          color: 'primary',
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
            y: this._config.format.height - 10,
            alignment: 'center',
            fontSize: 'sm',
            color: 'muted',
            static: true,
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
    return this.createText(header, { font: 'bold', fontSize: 'lg', color: 'primary', ...options })
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

  createSummary(project: Project, chart: string): this {
    const { createAddress } = useUtil()
    const address = createAddress({
      name: project?.name,
      street: project?.street,
      housenumber: project?.housenumber,
      postcode: project?.postcode,
      city: project?.city,
    })

    this.createSectionHeader('Mikrostandort')
      .createText(
        'Im Rahmen dieser Analyse wurde der Mikrostandort untersucht. Die Bewertung bezieht sich auf die unmittelbare Umgebung des Standorts und berücksichtigt relevante Angebote und Einrichtungen innerhalb eines definierten Radius zum  untersuchten Zeitpunkt.',
        { y: this._config.padding.top + 10 },
      )
      .createText('Standort:', {
        y: this._config.padding.top + 30,
        font: 'bold',
      })
      .createText(address, {
        x: this._config.padding.left + 17,
        y: this._config.padding.top + 30,
      })
      .createText('Untersuchter Umkreis:', {
        y: this._config.padding.top + 36,
        font: 'bold',
      })
      .createText(`${i18n.global.n(project.radius ?? Infinity, 'meter')}`, {
        x: this._config.padding.left + 40,
        y: this._config.padding.top + 36,
      })
      .createText('Stichtag:', {
        y: this._config.padding.top + 42,
        font: 'bold',
      })
      .createText(i18n.global.d(new Date()), {
        x: this._config.padding.left + 17,
        y: this._config.padding.top + 42,
      })

    this.createSectionHeader('Gesamtbewertung', { y: this._config.padding.top + 60 })
      .createScore(project.score ?? 0, 'Gesamtbewertung', this._config.padding.top + 70)
      .createText(
        `Der Standort erreicht in der Analyse ${i18n.global.n((project.score ?? 0) * 100, 'rounded')} von 100 möglichen Punkten. Diese Kennzahl bietet eine schnelle und verständliche Einschätzung der Standortqualität.`,
        { y: this._config.padding.top + 130 },
      )

    this.createSectionHeader('Einzelbewertungen', { y: this._config.padding.top + 150 })
      .createText(
        'Um die Stärken und Schwächen des Standorts zu betonen, wird die Analyse in verschiedene Bereiche unterteilt. Analysiert werden hierfür die Dimensionen Nahversorgung, Bildung, Erholung, Gesundheit, Freizeit und Mobilität.',
        { y: this._config.padding.top + 160 },
      )
      .createImage(chart, {
        x: this._config.format.width / 2 - 38, // center chart
        y: this._config.padding.top + 170,
        width: 76,
        height: 76,
      })

    return this
  }

  createDomainPage(pois: Poi[], scores: EvaluationScores, maps: Record<string, string>): this {
    // Find the closest POI for each category
    const closestPois = pois.reduce((acc: Poi[], poi) => {
      const existingIndex = acc.findIndex((p) => p.category === poi.category)
      if (existingIndex === -1) {
        // First POI of this category
        acc.push(poi)
      } else if (poi.distance < acc[existingIndex].distance) {
        // Found a closer POI for this category
        acc[existingIndex] = poi
      }
      return acc
    }, [])

    // Sort the closest POIs by distance
    closestPois.sort((a, b) => a.distance - b.distance)

    DOMAINS.forEach((domain) => {
      // Filter POIs that belong to the current domain's categories
      const categories = domain.categories.map((category) => category.name)
      const domainPois = closestPois.filter(
        (poi) => poi.category && categories.includes(poi.category),
      )

      this.newPage()
        .createSectionHeader(i18n.global.t(`domain.${domain.name}`))
        // TODO: Add descriptions for all domains
        .createText(
          'Unter dem Gesichtspunkt der Nahversorgung bewerten wir die Erreichbarkeit von Einrichtungen und Dienstleistungen des täglichen Bedarfs wie u.a. Supermärkte, Bäckereien oder Drogerien.',
          { y: this._config.padding.top + 10 },
        )
        .createImage(maps[domain.name], {
          x: this._config.padding.left,
          y: this._config.padding.top + 30,
          width: this._config.format.width - this._config.padding.left - this._config.padding.right,
          height:
            (this._config.format.width - this._config.padding.left - this._config.padding.right) *
            0.75,
        })
        .createScore(
          scores.domain[domain.name],
          `Bewertung ${i18n.global.t(`domain.${domain.name}`)}`,
          this._config.padding.top + 170,
        )
        .newPage()
        .createText(
          `Die nachfolgende Tabelle zeigt die nächstgelegenen Angebote in der Kategorie ${i18n.global.t(
            `domain.${domain.name}`,
          )}.`,
        )
        .createTable(
          [i18n.global.t('poi.category'), 'Nächstes Angebot', i18n.global.t('poi.distance')],
          domainPois.map((poi) => [
            i18n.global.t(`category.${poi.category}`),
            poi.label || i18n.global.t(`category.${poi.category}`),
            i18n.global.n(poi.distance, 'meter'),
          ]),
          {
            y: this._config.padding.top + 10,
            border: false,
            padding: 2,
            columnWidths: [30, 50, 20],
            head: { font: 'bold', fontSize: 'sm' },
            body: { fontSize: 'xs' },
            stripedColor: this._config.color.light,
          },
        )

      const padding = 2
      const cardsPerRow = 5
      const cardH = 20
      const CardW =
        (this._config.format.width -
          this._config.padding.left -
          this._config.padding.right -
          padding * (cardsPerRow - 1)) /
        cardsPerRow
      categories.forEach((category, i) => {
        const count = pois.filter((poi) => poi.category === category).length
        this.createCard(i18n.global.t(`category.${category}`), count ? count.toString() : '-', {
          x: this._config.padding.left + (i % cardsPerRow) * (CardW + padding),
          y: this._config.padding.top + 150 + Math.floor(i / cardsPerRow) * (cardH + padding),
          width: CardW,
          height: cardH,
          color: domain.color,
        })
      })
    })

    return this
  }

  createMethodic(): this {
    return this.createSectionHeader('Methodik')
      .createText(
        'Unsere Methodik orientiert sich an dem Leitbild der 15-Minuten-Stadt, einem modernen Konzept nachhaltiger Stadt- und Quartiersentwicklung. Dieses Modell stellt die Bedürfnisse der Menschen und ihren Alltag in den Mittelpunkt. Ziel ist es, alle wesentlichen Einrichtungen des täglichen Lebens innerhalb von maximal 15 Minuten zu Fuß oder mit dem Fahrrad erreichbar zu machen. So entsteht eine Stadt der kurzen Wege, die nicht nur die Lebensqualität steigert und die Abhängigkeit vom Auto reduziert, sondern auch die Nachhaltigkeit und Resilienz des urbanen Raums stärkt.',
        { y: this._config.padding.top + 10 },
      )
      .createImage(methodic, {
        x: this._config.format.width / 2 - 55,
        y: this._config.padding.top + 50,
        width: 110,
        height: 110,
      })
      .createText(
        'Auf dieser Grundlage analysieren wir den Standort anhand der zentralen Kriterien der 15-Minuten-Stadt. Dazu definieren wir einen Umkreis um den Standort, der dem Prinzip der 15-Minuten-Stadt entspricht. Innerhalb dieses Radius identifizieren und bewerten wir alle relevanten Angebote und Einrichtungen.\n\nDabei erfassen wir eine Vielzahl von Standortfaktoren aus den Bereichen Nahversorgung, Bildung, Erholung, Gesundheit, Freizeit und Mobilität. Jeder Bereich wird separat analysiert und mit einer Punktzahl zwischen 0 und 100 bewertet. Sowohl die Anzahl der vorhandenen Angebote als auch deren Entfernung zum Standort fließen in die Auswertung ein – je näher und zahlreicher die Angebote, desto besser die Bewertung. Auf diese Weise werden die spezifischen Stärken und Schwächen des Standorts klar und nachvollziehbar dargestellt.\n\nAus den Einzelbewertungen der Bereiche ermitteln wir eine abschließende Gesamtbewertung. Diese wird ebenfalls als Kennzahl zwischen 0 und 100 ausgewiesen und bietet auf einen Blick eine verständliche und vergleichbare Einschätzung der Standortqualität.',
        { y: this._config.padding.top + 170 },
      )
  }

  createScore(score: number, label: string, y: number): this {
    const { scoreToColor, scoreColorThresholds } = useColorUtil()

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
      .createText(label, {
        y: y + 25,
        height: 15,
        fontSize: 'xl2',
        color: 'neutral',
        alignment: 'center',
        verticalAlignment: 'middle',
      })

    // Score scale line
    let x = this._config.padding.left
    scoreColorThresholds.forEach((threshold, index) => {
      const range = threshold.max - (scoreColorThresholds[index - 1]?.max || 0)
      const width =
        (this._config.format.width - this._config.padding.left - this._config.padding.right) * range
      this.createRect({
        x,
        y: y + 47,
        width,
        height: 3,
        color: threshold.color,
      })
      x += width
    })

    this.createRect({
      x:
        this._config.padding.left +
        (this._config.format.width - this._config.padding.left - this._config.padding.right) *
          score -
        0.5,
      y: y + 46,
      width: 1,
      height: 5,
      color: 'text',
    })

    this.createText('0', {
      x: this._config.padding.left,
      y: y + 51,
      fontSize: 'xs',
      color: 'muted',
      alignment: 'left',
    }).createText('100', {
      x: this._config.padding.left,
      y: y + 51,
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
        x: xPos - 10,
        y: y + 51,
        width: 20,
        fontSize: 'xs',
        color: 'muted',
        alignment: 'center',
      })
    }

    return this
  }

  createLegalNotice(): this {
    return this.createSectionHeader('Rechtliche Hinweise').createText(
      'Dieser Bericht wurde mit größter Sorgfalt auf Basis der zum Zeitpunkt der Erstellung vorliegenden Daten und Informationen erstellt. Der Datenstand bezieht sich auf den im Bericht genannten Stichtag. Spätere Entwicklungen sind nicht berücksichtigt. Wir übernehmen keine Gewähr für die Vollständigkeit, Richtigkeit und Aktualität der enthaltenen Angaben.\n\nAlle Inhalte dieses Berichts sind Eigentum der Bayerischen Gesellschaft für Wohneigentum mbH & Co. KG. Er dient ausschließlich zu Informationszwecken und richtet sich ausschließlich an den benannten Empfänger.Eine vollständige oder auszugsweise Weitergabe an Dritte oder Veröffentlichung bedarf unserer vorherigen schriftlichen Zustimmung.\n\nAlle im Bericht enthaltenen Texte, Grafiken und Auswertungen sind urheberrechtlich geschützt und dürfen ohne ausdrückliche Genehmigung des Herausgebers nicht vervielfältigt oder anderweitig verwendet werden.',
      { y: this._config.padding.top + 10 },
    )
  }

  createAboutUs(): this {
    const company = useLegal().getCompanyData()

    return this.createSectionHeader('Über Uns')
      .createText(
        'Die Bayerische Gesellschaft für Wohneigentum mbH & Co. KG ist Teil der BGW Gruppe, die seit vielen Jahren erfolgreich im Immobilienmarkt und der Quartiersentwicklung tätig ist. Mit unserer langjährigen Expertise begleiten wir Projekte von der ersten Idee bis zur Umsetzung und schaffen so die Grundlage für nachhaltige und lebenswerte Stadtquartiere.\n\nAls spezialisierter Partner für datenbasierte Standortanalysen im urbanen Raum unterstützen wir Projektentwickler, Investoren und öffentliche Einrichtungen dabei, fundierte Entscheidungen zu treffen. Unser Ansatz verbindet fachliche Kompetenz in Stadtentwicklung, Nachhaltigkeit und Marktanalyse mit praxisnaher Umsetzung und orientiert sich am Leitbild der Stadt der kurzen Wege.\n\nUnsere Arbeit verbindet Fachwissen in Stadtentwicklung, Nachhaltigkeit und Marktanalyse mit praxisnaher Umsetzung. Dabei legen wir besonderen Wert auf das Leitbild der „Stadt der kurzen Wege“ und die Förderung lebenswerter, resilienter Städte.',
        { y: this._config.padding.top + 10 },
      )
      .createImage(logoBgw, {
        x: this._config.format.width / 2 - 40, // Center the logo
        y: this._config.padding.top + 90,
        width: 80,
        height: 80,
      })
      .createSectionHeader('Kontakt', {
        y: this._config.padding.top + 190,
        alignment: 'center',
      })
      .createText(
        `${company.name}\n${company.address}\nE-Mail: ${company.email}\nTelefon: ${company.phone}\nWebseite: ${company.web}`,
        { y: this._config.padding.top + 200, alignment: 'center', lineHeight: 1.5 },
      )
  }

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
      color: 'light',
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
