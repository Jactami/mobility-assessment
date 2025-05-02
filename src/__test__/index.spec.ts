import { describe, expect, it } from 'vitest'

describe('test vitest integration', () => {
  it('return correct validation', async () => {
    expect(1 + 2).toBe(3)
    expect(['a', 'b', 'c']).toHaveLength(3)
  })
})
