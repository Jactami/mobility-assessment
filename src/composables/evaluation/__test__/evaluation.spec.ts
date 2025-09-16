import { DOMAINS } from '@/constants'
import type { Poi } from '@/db/types'
import { describe, expect, it } from 'vitest'
import { useEvaluation } from '..'

/**
 * Mock a Point of Interest (POI) for testing purposes.
 * @param category The category of the POI, e.g. 'school', 'restaurant'.
 * @param distance The distance of the POI from a reference point, in meters.
 * @returns A mocked POI object.
 */
function mockPoi(category: string, distance: number): Poi {
  return {
    category,
    distance,
    // Mocked properties
    latitude: 0,
    longitude: 0,
    osm_id: -1,
    osm_type: 'node',
    project_id: '',
  }
}

describe('useEvaluation', () => {
  // Sample domain and category
  const DOMAIN = DOMAINS[0]
  if (!DOMAIN) throw new Error('No domain found for testing')

  const CATEGORY = DOMAIN.categories[0]
  if (!CATEGORY) throw new Error('No category found for testing')

  const radius = 1000 // 1000m
  const { calcScores } = useEvaluation()

  it('returns 0 scores when no POIs', () => {
    const scores = calcScores([], radius)

    expect(scores.total).toBe(0)
    for (const domain of DOMAINS) {
      expect(scores.domain[domain.name]).toBe(0)
    }
  })

  it('returns maximal score when POI at distance 0', () => {
    const categories = DOMAIN.categories.map((c) => c)
    const pois: Poi[] = []
    for (const category of categories) {
      const saturation = category.saturation || 1
      for (let i = 0; i < saturation; i++) {
        pois.push(mockPoi(category.name, 0))
      }
    }

    const scores = calcScores(pois, radius)

    expect(scores.domain[DOMAIN.name]).toBe(1)
    expect(scores.total).toBeGreaterThan(0)
  })

  it('scores decrease as distance increases', () => {
    const closePoi = mockPoi(CATEGORY.name, 100)
    const farPoi = mockPoi(CATEGORY.name, 900)

    const closeScore = calcScores([closePoi], radius).domain[DOMAIN.name]
    const farScore = calcScores([farPoi], radius).domain[DOMAIN.name]

    expect(closeScore).toBeGreaterThan(farScore)
  })

  it('scores saturate when many POIs in same category', () => {
    const pois = Array.from({ length: (CATEGORY.saturation || 1) * 2 }, () =>
      mockPoi(CATEGORY.name, 100),
    )

    const score = calcScores(pois, radius).domain[DOMAIN.name]

    expect(score).toBeLessThanOrEqual(1)
    expect(score).toBeGreaterThan(0)
  })

  it('handles multiple POIs correctly', () => {
    const category = 'school'
    const domain = DOMAINS.find((d) => d.categories.some((c) => c.name === category))
    expect(domain).toBeTruthy()

    const pois: Poi[] = [
      mockPoi(category, 0), // 1.0
      mockPoi(category, 500), // 0.8
      mockPoi(category, 1000), // 0.5
    ]

    const scores = calcScores(pois, radius)

    const scoreDomain = scores.domain[domain!.name]
    const expected = 0.861 / domain!.categories.length
    const epsilon = 0.01

    expect(scoreDomain).toBeGreaterThan(0)
    expect(Math.abs(scoreDomain - expected)).toBeLessThan(epsilon)
  })
})
