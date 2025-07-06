export function useColorUtil() {
  return {
    scoreToColor,
  }
}

/**
 * Get the color representation of a score.
 * @param score - A score value between 0 and 1.
 * @returns A color string representing the score.
 */
function scoreToColor(score: number): string {
  // Color thresholds based on score ranges
  const thresholds = [
    { max: 0.5, color: '#ff4d4f' }, // 0–50%
    { max: 0.6, color: '#ffa940' }, // 51–60%
    { max: 0.7, color: '#ffec3d' }, // 61–70%
    { max: 0.8, color: '#bae637' }, // 71–80%
    { max: 0.9, color: '#73d13d' }, // 81–90%
    { max: 1.0, color: '#52c41a' }, // 91–100%
  ]

  // Determine the color based on the score
  const clamped = Math.max(0, Math.min(1, score))
  for (const t of thresholds) {
    if (clamped <= t.max) {
      return t.color
    }
  }
  return '#d9d9d9' // fallback
}
