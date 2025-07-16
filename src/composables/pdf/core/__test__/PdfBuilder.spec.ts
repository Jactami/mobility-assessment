// Allow explicit any to access private and protected variables of PdfBuilder
/* eslint-disable @typescript-eslint/no-explicit-any */

import { generate } from '@pdfme/generator'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { PdfConfig } from '../../types'
import { PdfBuilder } from '../PdfBuilder'

// Mock the generate function to return a fixed Uint8Array
vi.mock('@pdfme/generator', () => ({
  generate: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
}))

// Dummy config for testing
const config: PdfConfig = {
  format: {
    width: 210,
    height: 297,
  },
  padding: {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
  },
  color: {
    primary: '#000',
    text: '#000',
  },
  fontSize: { base: 12 },
}

describe('PdfBuilder', () => {
  let builder: PdfBuilder

  // Get a fresh instance of PdfBuilder before each test
  beforeEach(() => {
    builder = new PdfBuilder(config)
  })

  it('should create a text element', () => {
    builder.createText('Hello World!', {
      x: 10,
      y: 20,
      width: 100,
      height: 50,
      lineHeight: 1.5,
      alignment: 'center',
    })

    // Check schema
    const schemas = (builder as any)._schemas
    const schema = schemas[0][0]

    expect(schemas[0].length).toBe(1)
    expect(schema).toMatchObject({
      type: 'text',
      position: { x: 10, y: 20 },
      width: 100,
      height: 50,
      fontSize: 12,
      lineHeight: 1.5,
      alignment: 'center',
    })

    // Check inputs
    const inputs = (builder as any)._inputs
    const id = schema.name

    expect(inputs).toHaveProperty(id, 'Hello World!')
  })

  // TODO: Add more tests for other methods like createImage, createTable, etc.

  it('should add a new page', () => {
    builder.newPage().createText('Page 2')
    const schemas = (builder as any)._schemas

    expect(schemas.length).toBe(2)
    expect(schemas[1].length).toBe(1)
  })

  it('should call generate on build and reset state', async () => {
    await builder.createText('Hello World!').build()

    expect((builder as any)._schemas).toEqual([[]]) // schemas should be reset
    expect((builder as any)._inputs).toEqual({}) // inputs should be reset
    expect(generate).toHaveBeenCalled()
  })
})
