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
  const radius = 1000 // 1000m
  const { calcScores, SATURATION_THRESHOLD } = useEvaluation()

  it('returns 0 scores when no POIs', () => {
    const scores = calcScores([], radius)

    expect(scores.total).toBe(0)
    for (const domain of DOMAINS) {
      expect(scores.domain[domain.name]).toBe(0)
    }
  })

  it('returns maximal score when POI at distance 0', () => {
    const categories = DOMAINS[0].categories.map((c) => c.name)
    const pois: Poi[] = []
    for (const category of categories) {
      for (let i = 0; i < SATURATION_THRESHOLD; i++) {
        pois.push(mockPoi(category, 0))
      }
    }

    const scores = calcScores(pois, radius)

    expect(scores.domain[DOMAINS[0].name]).toBe(1)
    expect(scores.total).toBeGreaterThan(0)
  })

  it('scores decrease as distance increases', () => {
    const category = DOMAINS[0].categories[0].name
    const closePoi = mockPoi(category, 100)
    const farPoi = mockPoi(category, 900)

    const closeScore = calcScores([closePoi], radius).domain[DOMAINS[0].name]
    const farScore = calcScores([farPoi], radius).domain[DOMAINS[0].name]

    expect(closeScore).toBeGreaterThan(farScore)
  })

  it('scores saturate when many POIs in same category', () => {
    const category = DOMAINS[0].categories[0].name
    const pois = Array.from({ length: SATURATION_THRESHOLD * 2 }, () => mockPoi(category, 100))

    const score = calcScores(pois, radius).domain[DOMAINS[0].name]

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
