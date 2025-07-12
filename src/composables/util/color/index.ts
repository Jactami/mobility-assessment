import { DOMAINS } from '@/constants'

export function useColorUtil() {
  return {
    categoryToColor,
    scoreToColor,
    scoreColorThresholds,
  }
}

// Diverging color thresholds for scores
const scoreColorThresholds = [
  { max: 0.5, color: '#d32029' },
  { max: 0.6, color: '#d46b08' },
  { max: 0.7, color: '#d4b106' },
  { max: 0.8, color: '#7cb305' },
  { max: 0.9, color: '#389e0d' },
  { max: 1.0, color: '#237804' },
]

// Alternate monochrome color thresholds for scores
// const scoreColorThresholds = [
//   { max: 0.5, color: '#27c984' },
//   { max: 0.6, color: '#21aa70' },
//   { max: 0.7, color: '#1c8b5c' },
//   { max: 0.8, color: '#166c48' },
//   { max: 0.9, color: '#114d34' },
//   { max: 1.0, color: '#0b2e20' },
// ]

/**
 * Get the color representation of a score.
 * @param score - A score value between 0 and 1.
 * @returns A color string representing the score.
 */
function scoreToColor(score: number): string {
  // Determine the color based on the score
  const clamped = Math.max(0, Math.min(1, score))
  for (const t of scoreColorThresholds) {
    if (clamped <= t.max) {
      return t.color
    }
  }
  return '#d9d9d9' // fallback
}

/**
 * Get the color representation of the domain of a category.
 * @param category - The category name to find the corresponding color.
 * @returns A color string representing the category.
 */
function categoryToColor(category: string): string {
  const domain = DOMAINS.find((domain) => domain.categories.some((cat) => cat.name === category))
  return domain ? domain.color : '#FFFFFF'
}
