import type { AreaDomain } from '@/types'

export const DOMAINS: AreaDomain[] = [
  // Bildung + Erziehung
  {
    name: 'education',
    color: '#f0f', // TODO: Temporary color
    icon: '',
    categories: [
      {
        name: 'school',
        tagKey: 'amenity',
        tagValue: 'school',
      },
      {
        name: 'university',
        tagKey: 'amenity',
        tagValue: 'university',
      },
      {
        name: 'kindergarten',
        tagKey: 'amenity',
        tagValue: 'kindergarten',
      },
      {
        name: 'library',
        tagKey: 'amenity',
        tagValue: 'library',
      },
    ],
  },
  // Freizeit + Unterhaltung
  {
    name: 'leisure',
    color: '',
    icon: '',
    categories: [],
  },
  // Gesundheit + Medizin
  {
    name: 'healthcare',
    color: '',
    icon: '',
    categories: [],
  },
  // Nahverkehr + Mobilität
  {
    name: 'mobility', // TODO: change to transport (?)
    color: '',
    icon: '',
    categories: [],
  },
  // Naherholung + Natur
  {
    name: 'nature',
    color: '',
    icon: '',
    categories: [],
  },
  // Nahversorgung + Dienstleistungen
  {
    name: 'daily needs',
    color: '#ff0', // TODO: Temporary color
    icon: '',
    categories: [
      {
        name: 'supermarket',
        tagKey: 'shop',
        tagValue: 'supermarket',
      },
      {
        name: 'bakery',
        tagKey: 'shop',
        tagValue: 'bakery',
      },
    ],
  },
  // TODO: maybe add a grouping for 'work'?
]
