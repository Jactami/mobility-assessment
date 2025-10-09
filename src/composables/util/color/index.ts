import { factorConfig } from '@/config/app'

export function useColorUtil() {
  return {
    categoryToColor,
    scoreToColor,
    scoreColorThresholds,
  }
}

// Diverging color thresholds for scores
const scoreColorThresholds = [
  { min: 0.8, color: '#237804' },
  // { min: 0.6, color: '#389e0d' },
  { min: 0.6, color: '#7cb305' },
  { min: 0.4, color: '#d4b106' },
  { min: 0.2, color: '#d46b08' },
  { min: 0.0, color: '#d32029' },
]

// Alternate monochrome color thresholds for scores
// const scoreColorThresholds = [
// //   { min: 0.9, color: '#0b2e20' },
//   { min: 0.8, color: '#114d34' },
//   { min: 0.6, color: '#166c48' },
//   { min: 0.4, color: '#1c8b5c' },
//   { min: 0.2, color: '#21aa70' },
//   { min: 0.0, color: '#27c984' },
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
    if (clamped >= t.min) {
      return t.color
    }
  }
  return '' // fallback
}

/**
 * Get the color representation of the factor of a category.
 * @param category - The category name to find the corresponding color.
 * @returns A color string representing the category.
 */
function categoryToColor(category: string): string {
  const factor = factorConfig.find((factor) =>
    factor.categories.some((cat) => cat.name === category),
  )
  return factor ? factor.color : ''
}
