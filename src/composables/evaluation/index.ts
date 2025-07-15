import { DOMAINS } from '@/constants'
import type { Poi } from '@/db/types'
import { useProjectUtil } from '../util/project'
import type { EvaluationScores } from './types'

/**
 * Distance dampening factor to reduce the score of a POI with increasing distance.
 * TODO: Play with this value to find the best fit for the scoring system.
 */
const DISTANCE_DAMPEN = 2

/**
 * Maximum amount of POIs per category that can contribute to the score.
 * TODO: Use different values for different categories, e.g. 2 for schools, 5 for restaurants, etc.?
 */
const SATURATION_THRESHOLD = 3

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
  // score = minScore + (1 - minScore) / (1 + Math.pow(poi.distance / radius, DISTANCE_DAMPEN))

  // Option 3: logistic function
  score = 1 / (1 + Math.pow(poi.distance / radius, DISTANCE_DAMPEN))

  return score
}

function calcScoreCategory(pois: Poi[], radius: number) {
  const sum = pois.reduce((acc, poi) => acc + calcScorePoi(poi, radius), 0)
  const norm = Math.log(1 + sum) / Math.log(1 + SATURATION_THRESHOLD) // limit between 0 and 1
  return Math.min(1, norm)
}

function calcScores(pois: Poi[], radius: number): EvaluationScores {
  const { getPoisByCategory } = useProjectUtil()

  // Init empty scores
  const scores: EvaluationScores = {
    total: 0,
    domain: {},
  }

  // Iterate over all domains
  for (const domain of DOMAINS) {
    const scoresCategory: number[] = []

    // Calculate the score for each category in the current domain
    for (const category of domain.categories) {
      const categoryPois = getPoisByCategory(pois, category.name)

      const score = calcScoreCategory(categoryPois, radius)
      scoresCategory.push(score)
    }

    // Calculate the domain score as the average of the category scores
    // TODO: Consider using a weighted average if some categories are more important than others
    const scoreDomain = scoresCategory.length
      ? scoresCategory.reduce((a, b) => a + b, 0) / scoresCategory.length
      : 0

    scores.domain[domain.name] = Math.round(scoreDomain * 100) / 100
  }

  // Calculate the total score as the average of all domain scores
  // TODO: Consider using a weighted average if some domains are more important than others
  const scoreTotal = Object.values(scores.domain).reduce((a, b) => a + b, 0) / DOMAINS.length
  scores.total = Math.round(scoreTotal * 100) / 100

  return scores
}

export function useEvaluation() {
  return {
    DISTANCE_DAMPEN,
    SATURATION_THRESHOLD,
    calcScores,
  }
}
