import type { AreaDomain } from '@/types'

export interface EvaluationScores {
  total: number
  domain: Record<AreaDomain['name'], number>
}
