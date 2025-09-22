/**
 * Organizes categories into semantic groups such as leisure, education, medical, etc.
 */
export interface GeoDimension {
  /** The name of the dimension. */
  name: string
  /** Hex color code representing the dimension. */
  color: string
  /** List of categories within the dimension. */
  categories: GeoCategory[]
}

/**
 * Tag associated with a category.
 */
interface GeoCategoryTag {
  /** Openstreetmap tag key. */
  key: string
  /** Openstreetmap tag value. */
  value: string
}

/**
 * Represents a point of interest within a dimension, such as supermarkets, doctors, restaurants, etc.
 */
export interface GeoCategory {
  /** The name of the category. */
  name: string
  /** List of tags associated with the category. */
  tags: GeoCategoryTag[]
  /** List of optional rules for labeling. */
  labelRules?: {
    /** Tags that must match for this rule to apply. */
    matches: GeoCategoryTag[]
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
