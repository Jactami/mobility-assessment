export function useColorUtil() {
  return {
    scoreToColor,
    scoreColorThresholds,
  }
}

const scoreColorThresholds = [
  { max: 0.5, color: '#d32029' },
  { max: 0.6, color: '#d46b08' },
  { max: 0.7, color: '#d4b106' },
  { max: 0.8, color: '#7cb305' },
  { max: 0.9, color: '#389e0d' },
  { max: 1.0, color: '#237804' },
]

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
