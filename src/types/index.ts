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
  color: string
  icon: string
  tag: string
}
