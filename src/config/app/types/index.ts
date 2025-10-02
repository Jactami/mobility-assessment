/**
 * Organizes categories into semantic groups such as leisure, education, medical, etc.
 */
export interface LocationFactor {
  /** The name of the location factor. */
  name: string
  /** Hex color code representing the location factor. */
  color: string
  /** List of categories within the location factor. */
  categories: FactorCategory[]
}

/**
 * Tag associated with a category.
 */
interface FactorCategoryTag {
  /** Openstreetmap tag key. */
  key: string
  /** Openstreetmap tag value. */
  value: string
}

/**
 * Represents a point of interest within a location factor, such as supermarkets, doctors, restaurants, etc.
 */
export interface FactorCategory {
  /** The name of the category. */
  name: string
  /** List of tags associated with the category. */
  tags: FactorCategoryTag[]
  /** List of optional rules for labeling. */
  labelRules?: {
    /** Tags that must match for this rule to apply. */
    matches: FactorCategoryTag[]
    /** Fallback tag to use if no name tag is found. */
    fallback?: string
    /** Label to use instead of the name tag. */
    label?: string
    /** Prefix to append to the label. */
    prefix?: string
    // An alternative and more flexible approach could be a label with placeholders
    // e.g. "Bushaltestell {name}" where {name} is replaced with the actual name
  }[]
  /**
   * Maximum number of elements that can contribute to the score.
   * TODO: Play with this value to find the best fit for the scoring system.
   */
  saturation?: number
}
