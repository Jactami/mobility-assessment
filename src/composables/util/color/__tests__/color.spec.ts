import { describe, expect, it } from 'vitest'
import { useColorUtil } from '..'

const { scoreToColor } = useColorUtil()

describe('scoreToColor', () => {
  it('returns correct colors for typical scores', () => {
    expect(scoreToColor(0.85)).toBe('#237804')
    expect(scoreToColor(0.65)).toBe('#7cb305')
    expect(scoreToColor(0.45)).toBe('#d4b106')
    expect(scoreToColor(0.25)).toBe('#d46b08')
    expect(scoreToColor(0.05)).toBe('#d32029')
  })

  it('handles edge cases (clamping and boundaries)', () => {
    expect(scoreToColor(1.0)).toBe('#237804') // upper bound
    expect(scoreToColor(0.8)).toBe('#237804') // exact thresholds
    expect(scoreToColor(0.6)).toBe('#7cb305')
    expect(scoreToColor(0.4)).toBe('#d4b106')
    expect(scoreToColor(0.2)).toBe('#d46b08')
    expect(scoreToColor(0.0)).toBe('#d32029') // lower bound
    expect(scoreToColor(1.5)).toBe('#237804') // above 1.0 -> clamped
    expect(scoreToColor(-0.3)).toBe('#d32029') // below 0.0 -> clamped
    expect(scoreToColor(NaN)).toBe('') // invalid input
  })
})
