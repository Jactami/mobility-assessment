import { describe, expect, it } from 'vitest'
import { useUtil } from '..'

describe('createAddress', () => {
  const { createAddress } = useUtil()

  it('should return full address when all fields are provided', () => {
    const result = createAddress({
      name: 'Universität Bamberg',
      street: 'Feldkirchenstraße',
      housenumber: '21',
      postcode: '96052',
      city: 'Bamberg',
    })
    expect(result).toBe('Universität Bamberg, Feldkirchenstraße 21, 96052 Bamberg')
  })

  it('should return only name when only name is provided', () => {
    const result = createAddress({ name: 'Universität Bamberg' })
    expect(result).toBe('Universität Bamberg')
  })

  it('should return empty string when no fields are provided', () => {
    const result = createAddress({})
    expect(result).toBe('')
  })

  it('should handle only street and housenumber', () => {
    const result = createAddress({ street: 'Feldkirchenstraße', housenumber: '21' })
    expect(result).toBe('Feldkirchenstraße 21')
  })

  it('should handle only postcode and city', () => {
    const result = createAddress({ postcode: '96052', city: 'Bamberg' })
    expect(result).toBe('96052 Bamberg')
  })

  it('should handle only city', () => {
    const result = createAddress({ city: 'Bamberg' })
    expect(result).toBe('Bamberg')
  })
})
