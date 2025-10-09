import type { LocationFactor } from '@/config/app/types'
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

// Custom test config
const mockedConfig: LocationFactor[] = [
  {
    name: 'factor',
    color: '',
    categories: [
      {
        name: 'category',
        saturation: 3,
        tags: [],
      },
    ],
  },
]

describe('useEvaluation', () => {
  const radius = 1000
  const { calcScores } = useEvaluation()

  it('returns 0 scores when no POIs', () => {
    const scores = calcScores([], radius, mockedConfig)

    expect(scores.total).toBe(0)
    expect(scores.partial['factor']).toBe(0)
  })

  it('returns maximal score when POIs at distance 0 (full saturation)', () => {
    // 3 POIs because saturation is 3 (with distance 0 to maximize score)
    const pois: Poi[] = [mockPoi('category', 0), mockPoi('category', 0), mockPoi('category', 0)]
    const scores = calcScores(pois, radius, mockedConfig)

    expect(scores.partial['factor']).toBe(1)
    expect(scores.total).toBe(1)
  })

  it('scores decrease as distance increases', () => {
    const closePoi = mockPoi('category', 100)
    const farPoi = mockPoi('category', 900)

    const closeScore = calcScores([closePoi], radius, mockedConfig).partial['factor']
    const farScore = calcScores([farPoi], radius, mockedConfig).partial['factor']

    expect(closeScore).toBeDefined()
    expect(farScore).toBeDefined()
    expect(closeScore).toBeGreaterThan(farScore!)
  })

  it('scores saturate when many POIs in same category', () => {
    const pois = Array.from({ length: 10 }, () => mockPoi('category', 100))

    const score = calcScores(pois, radius, mockedConfig).partial['factor']

    expect(score).toBeLessThanOrEqual(1)
    expect(score).toBeGreaterThan(0)
  })

  it('handles multiple POIs correctly', () => {
    const pois: Poi[] = [
      mockPoi('category', 0), // score = 1.0
      mockPoi('category', radius * 0.5), // score = 0.89
      mockPoi('category', radius), // score = 0.5
    ]

    const scores = calcScores(pois, radius, mockedConfig)
    const result = scores.partial['factor']
    const expected = 0.88

    expect(result).toBeCloseTo(expected, 2)
  })
})
