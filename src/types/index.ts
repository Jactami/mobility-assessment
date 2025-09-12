/**
 * Organizes categories into semantic groups such as leisure, education, medical, etc.
 */
export interface AreaDomain {
  /** The name of the domain.*/
  name: 'education' | 'leisure' | 'health' | 'supply' | 'recreation' | 'mobility'
  /** Hex color code representing the domain.*/
  color: string
  /** List of categories within the domain. */
  categories: AreaCategory[]
}

/**
 * Tag associated with a category.
 */
interface AreaCategoryTag {
  /** Openstreetmap tag key. */
  key: string
  /** Openstreetmap tag value. */
  value: string
}

/**
 * Represents a point of interest within a domain, such as supermarkets, doctors, restaurants, etc.
 */
export interface AreaCategory {
  /** The name of the category. */
  name: string
  /** List of tags associated with the category. */
  tags: AreaCategoryTag[]
  /** List of optional rules for labeling. */
  labelRules?: {
    /** Tags that must match for this rule to apply. */
    matches: AreaCategoryTag[]
    /** Fallback tag to use if no name tag is found. */
    fallback?: string
    /** Label to use instead of the name tag. */
    label?: string
    /** Prefix to append to the label. */
    prefix?: string
    // An alternative and more flexible approach could be a label with placeholders
    // e.g. "Bushaltestell {name}" where {name} is replaced with the actual name
  }[]
}
