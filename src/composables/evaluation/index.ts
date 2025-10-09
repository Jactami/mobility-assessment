import { factorConfig } from '@/config/app'
import type { Poi } from '@/db/types'
import { useProjectUtil } from '../util/project'
import type { EvaluationScores } from './types'

/**
 * Distance dampening factor to reduce the score of a POI with increasing distance.
 * TODO: Play with this value to find the best fit for the scoring system.
 */
const DISTANCE_DAMPEN = 3

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

/**
 * Calculates the score for a category of POIs based on their distances from a reference point.
 * @param pois Array of POIs in the same category
 * @param radius The radius within which the POIs are considered relevant
 * @param saturation The saturation point for the category, default is 1
 * @returns The calculated score for the category.
 */
function calcScoreCategory(pois: Poi[], radius: number, saturation: number = 1) {
  let score = 0

  // Option 1:
  // const sum = pois.reduce((acc, poi) => acc + calcScorePoi(poi, radius) / (1 + saturation - 1), 0)
  // score = Math.min(1, sum)

  // Option 2:
  // Sum up the scores of all POIs in the category
  const sum = pois.reduce((acc, poi) => acc + calcScorePoi(poi, radius), 0)
  // Apply diminishing returns with saturation threshold
  const norm = Math.log(1 + sum) / Math.log(1 + saturation)
  // Limit score between 0 and 1 just to be sure
  score = Math.min(1, norm)

  return score
}

/**
 * Calculates the scores for a set of POIs based on their distances from a reference point.
 * @param pois Array of POIs to evaluate
 * @param radius The radius within which the POIs are considered relevant
 * @param config The factor configuration to use for evaluation, default is the global factorConfig
 * @returns The calculated scores for the POIs.
 */
function calcScores(pois: Poi[], radius: number, config = factorConfig): EvaluationScores {
  const { getPoisByCategory } = useProjectUtil()

  // Init empty scores
  const scores: EvaluationScores = {
    total: 0,
    partial: {} as Record<string, number>,
  }

  // Iterate over all factors
  for (const factor of config) {
    const scoresCategory: number[] = []

    // Calculate the score for each category in the current factor
    for (const category of factor.categories) {
      const categoryPois = getPoisByCategory(pois, category.name)
      const saturation = category.saturation ?? 1

      const score = calcScoreCategory(categoryPois, radius, saturation)
      scoresCategory.push(score)
    }

    // Calculate the factor score as the average of the category scores
    // TODO: Consider using a weighted average if some categories are more important than others
    const scoreFactor = scoresCategory.length
      ? scoresCategory.reduce((a, b) => a + b, 0) / scoresCategory.length
      : 0

    scores.partial[factor.name] = Math.round(scoreFactor * 100) / 100
  }

  // Calculate the total score as the average of all factor scores
  // TODO: Consider using a weighted average if some factors are more important than others
  const scoreTotal = Object.values(scores.partial).reduce((a, b) => a + b, 0) / config.length
  scores.total = Math.round(scoreTotal * 100) / 100

  return scores
}

export function useEvaluation() {
  return { calcScores }
}
