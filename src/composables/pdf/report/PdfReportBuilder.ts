import { PdfBuilder } from '../core/PdfBuilder'
import type { PdfTextOptions } from '../types'

export class PdfReportBuilder extends PdfBuilder {
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
}
