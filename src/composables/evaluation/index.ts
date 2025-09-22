import { geoConfig } from '@/config/geo'
import type { Poi } from '@/db/types'
import { useProjectUtil } from '../util/project'
import type { EvaluationScores } from './types'

/**
 * Distance dampening factor to reduce the score of a POI with increasing distance.
 * TODO: Play with this value to find the best fit for the scoring system.
 */
const DISTANCE_DAMPEN = 2

/**
 * Calculate the score for a point of interest (POI) based on its distance from a reference point.
 * The score is maximized if the poi is close to the reference point and decreases as the distance increases.
 * @param poi The point of interest to evaluate.
 * @param radius The radius within which the POI is considered relevant.
 * @returns The calculated score for the POI.
 */
function calcScorePoi(poi: Poi, radius: number) {
  let score = 0

  // Option 1: distance dampening
  // const ratio = Math.min(poi.distance / radius, 1) // 1 if d=0, ~0 if d=radius
  // score = Math.max(0, 1 - Math.pow(ratio, DISTANCE_DAMPEN))

  // Option 2: Minimum scoring
  // const minScore = 0.2
  // score = minScore + (1 - minScore) * (1 + Math.pow(poi.distance / radius, DISTANCE_DAMPEN))

  // Option 3: logistic function
  score = 1 / (1 + Math.pow(poi.distance / radius, DISTANCE_DAMPEN))

  return score
}

function calcScoreCategory(pois: Poi[], radius: number, saturation: number = 1) {
  // Sum up the scores of all POIs in the category
  const sum = pois.reduce((acc, poi) => acc + calcScorePoi(poi, radius), 0)

  // Apply diminishing returns and limit score between 0 and 1
  const norm = Math.log(1 + sum) / Math.log(1 + saturation)
  return Math.min(1, norm)
}

function calcScores(pois: Poi[], radius: number): EvaluationScores {
  const { getPoisByCategory } = useProjectUtil()

  // Init empty scores
  const scores: EvaluationScores = {
    total: 0,
    partial: {} as Record<string, number>,
  }

  // Iterate over all dimensions
  for (const dimension of geoConfig) {
    const scoresCategory: number[] = []

    // Calculate the score for each category in the current dimension
    for (const category of dimension.categories) {
      const categoryPois = getPoisByCategory(pois, category.name)
      const saturation = category.saturation ?? 1

      const score = calcScoreCategory(categoryPois, radius, saturation)
      scoresCategory.push(score)
    }

    // Calculate the dimension score as the average of the category scores
    // TODO: Consider using a weighted average if some categories are more important than others
    const scoreDimension = scoresCategory.length
      ? scoresCategory.reduce((a, b) => a + b, 0) / scoresCategory.length
      : 0

    scores.partial[dimension.name] = Math.round(scoreDimension * 100) / 100
  }

  // Calculate the total score as the average of all dimension scores
  // TODO: Consider using a weighted average if some dimensions are more important than others
  const scoreTotal = Object.values(scores.partial).reduce((a, b) => a + b, 0) / geoConfig.length
  scores.total = Math.round(scoreTotal * 100) / 100

  return scores
}

export function useEvaluation() {
  return {
    DISTANCE_DAMPEN,
    calcScores,
  }
}
