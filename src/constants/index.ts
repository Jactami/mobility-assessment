import type { AreaDomain } from '@/types'

export const DOMAINS: AreaDomain[] = [
  // Bildung + Erziehung
  {
    name: 'education',
    color: '',
    icon: '',
    categories: [],
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
    color: '',
    icon: '',
    categories: [
      {
        name: 'supermarket',
        color: '#ff0', // TODO: Temporary color
        icon: '',
        tagKey: 'shop',
        tagValue: 'supermarket',
      },
      {
        name: 'bakery',
        color: '#f0f', // TODO: Temporary color
        icon: '',
        tagKey: 'shop',
        tagValue: 'bakery',
      },
    ],
  },
  // TODO: maybe add a grouping for 'work'?
]
