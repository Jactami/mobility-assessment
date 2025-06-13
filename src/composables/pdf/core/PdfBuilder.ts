import { PDFME_VERSION, type Font, type Plugin, type Schema } from '@pdfme/common'
import { generate } from '@pdfme/generator'
import { image, text } from '@pdfme/schemas'
import type { PdfConfig, PdfImageOptions, PdfTextOptions } from '../types'

/**
 * A class for building PDF documents.
 * @example
 * const pdf = await new PdfBuilder()
 *  .createText('Hello, World!', { x: 10, y: 10 })
 *  .build()
 */
export class PdfBuilder {
  /**
   * Configuration options for the PDF document, such as format, padding, colors, and font sizes.
   */
  protected _config: PdfConfig

  /**
   * The fonts used in the PDF document.
   */
  protected _fonts?: Font

  /**
   * An object containing schema plugins that extend the the types of schemas that can be used.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected _plugins: Record<string, Plugin<any>> = {}

  /**
   * An array of schemas representing the layout and styling of the PDF document.
   */
  protected _schemas: Schema[][] = [[]]

  /**
   * An object mapping unique IDs to input strings for the PDF document.
   */
  protected _inputs: Record<number, string> = {}

  /**
   * A unique identifier for the current schema and input.
   */
  protected _id: string = crypto.randomUUID()

  /**
   * The current page number in the PDF document.
   */
  protected _page: number = 0

  /**
   * Creates an instance of the PdfBuilder class.
   * @param config - Configuration options for the PDF document, such as format, padding, colors, and font sizes.
   */
  constructor(config: PdfConfig, fonts?: Font) {
    this.reset()
    this._config = config
    this._fonts = fonts
  }

  /**
   * Generates a PDF document based on the schemas and inputs provided to the builder.
   * @returns A Promise that resolves to a Blob representing the generated PDF document.
   */
  public async build(): Promise<Blob> {
    // Load fonts if available
    const fonts = await this.loadFonts()
    console.log(fonts)

    // Generate pdf
    const pdf = await generate({
      template: {
        schemas: this._schemas,
        basePdf: {
          width: this._config.format[0],
          height: this._config.format[1],
          padding: this._config.padding,
        },
        pdfmeVersion: PDFME_VERSION,
      },
      inputs: [this._inputs],
      plugins: this._plugins,
      options: { font: fonts },
    })

    // Transform pdf to Blob
    const blob = new Blob([pdf.buffer], { type: 'application/pdf' })

    // Reset the builder to its initial state
    this.reset()

    // Return the generated PDF as a Blob
    return blob
  }

  /**
   * Resets the builder to its initial state.
   */
  protected reset(): void {
    this._schemas = [[]]
    this._inputs = {}
    this._page = 0
    this._id = crypto.randomUUID()
  }

  /**
   * Adds a new schema and input to the current page.
   * @param input - The input string to be added to the current page.
   * @param schema - The schema object defining the layout and styling of the content.
   * @returns The instance itself, allowing for method chaining.
   */
  private addToPage(input: string, schema: Schema): this {
    // Assign the schema and input to the current page
    this._schemas[this._page].push(schema)
    this._inputs = { ...this._inputs, [this._id]: input }

    // Generate a unique ID for the next schema and input
    this._id = crypto.randomUUID()

    return this
  }

  /**
   * Creates a new page in the PDF document.
   * @returns The instance itself, allowing for method chaining.
   */
  public newPage(): this {
    this._page++
    this._schemas.push([])
    return this
  }

  /**
   * Creates a text element in the PDF document.
   * @param data - The text to be added to the PDF document.
   * @param options - The layout and styling options for the text.
   * @returns The instance itself, allowing for method chaining.
   */
  public createText(data: string, options: PdfTextOptions): this {
    // Add text plugin
    this._plugins.text = text

    // Create schema for the text element
    const schema: Schema = {
      type: 'text',
      name: this._id,
      position: {
        x: options.x,
        y: options.y,
      },
      width:
        options.width || this._config.format[0] - this._config.padding[1] - this._config.padding[3],
      height: options.height || 0, // Height is auto-calculated based on the text content
      fontName: options.font, // falls back to the font with fallback flag set to true, if not provided
      fontColor: options.color || this._config.color?.text || undefined,
      fontSize: options.fontSize || this._config.fontSize?.base,
      alignment: options.alignment,
    }

    // Append the text element to the current page
    return this.addToPage(data, schema)
  }

  /**
   * Prints the given data onto the current page.
   * @param data - The content to be displayed.
   * @param options - The layout and styling options for the text.
   * @returns The instance itself, allowing for method chaining.
   */
  public printData(data: unknown, options: { x: number; y: number }): this {
    return this.createText(JSON.stringify(data), options)
  }

  /**
   * Creates a image element in the PDF document.
   * @param data - The image data to be added to the PDF document as a base64 string.
   * @param options - The layout and styling options for the image.
   * @returns The instance itself, allowing for method chaining.
   */
  public createImage(data: string, options: PdfImageOptions): this {
    // Add image plugin
    this._plugins.image = image

    // Create schema for the image element
    const schema: Schema = {
      type: 'image',
      name: this._id,
      position: {
        x: options.x,
        y: options.y,
      },
      width: options.width,
      height: options.height,
    }

    // Append the image element to the current page
    return this.addToPage(data, schema)
  }

  /**
   * Loads the fonts defined in the builder.
   * @returns A Promise that resolves to an object containing the loaded fonts.
   */
  private async loadFonts(): Promise<Font | undefined> {
    if (!this._fonts) return

    // Iterate over fonts to load and process font files
    const fonts: Font = {}
    for (const key of Object.keys(this._fonts)) {
      const font = this._fonts[key]
      if (typeof font.data === 'string') {
        fonts[key] = {
          data: await fetch(font.data).then(async (res) => await res.arrayBuffer()),
          fallback: font.fallback || false,
        }
      } else {
        fonts[key] = font
      }
    }

    return fonts
  }
}
