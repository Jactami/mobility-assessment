/**
 * Organizes categories into semantic groups such as leisure, education, medical, etc.
 */
export interface AreaDomain {
  name: string
  color: string
  icon: string
  categories: AreaCategory[]
}

/**
 * Represents a point of interest within a domain, such as supermarkets, doctors, restaurants, etc.
 */
export interface AreaCategory {
  name: string
  tags: {
    key: string
    value: string
  }[]
  labelRules?: {
    matches: {
      key: string
      value: string
    }[]
    label?: string
    prefix?: string
    // An alternative and more flexible approach could be a label with placeholders
    // e.g. "Bushaltestell {name}" where {name} is replaced with the actual name
  }[]
}
