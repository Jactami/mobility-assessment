import type { Template } from '@pdfme/common'
import { generate } from '@pdfme/generator'

export function usePdf() {
  async function createPdf() {
    const template: Template = {
      basePdf: { width: 210, height: 297, padding: [10, 10, 10, 10] },
      schemas: [
        [
          {
            name: 'a',
            type: 'text',
            position: { x: 0, y: 0 },
            width: 10,
            height: 10,
          },
          {
            name: 'b',
            type: 'text',
            position: { x: 10, y: 10 },
            width: 10,
            height: 10,
          },
          {
            name: 'c',
            type: 'text',
            position: { x: 20, y: 20 },
            width: 10,
            height: 10,
          },
        ],
      ],
    }

    const inputs = [{ a: 'a1', b: 'b1', c: 'c1' }]

    const pdf = await generate({ template, inputs })
    return pdf
  }

  return {
    createPdf,
  }
}
