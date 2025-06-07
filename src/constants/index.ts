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
    name: 'mobility', // TODO: change transport (?)
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
        color: '',
        icon: '',
        tag: 'shop=supermarket',
      },
      {
        name: 'bakery',
        color: '',
        icon: '',
        tag: 'shop=bakery',
      },
    ],
  },
  // TODO: maybe add a grouping for 'work'?
]
