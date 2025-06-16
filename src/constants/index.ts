import type { AreaDomain } from '@/types'

// Colors are taken from ColorBrewer's Dark2 scheme:
// https://colorbrewer2.org/#type=qualitative&scheme=Dark2&n=6

export const DOMAINS: AreaDomain[] = [
  // Bildung + Erziehung
  {
    name: 'education',
    color: '#1b9e77',
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
    color: '#d95f02',
    icon: '',
    categories: [
      {
        name: 'restaurant',
        tagKey: 'amenity',
        tagValue: 'restaurant',
      },
      {
        name: 'cafe',
        tagKey: 'amenity',
        tagValue: 'cafe',
      },
      {
        name: 'bar',
        tagKey: 'amenity',
        tagValue: 'bar',
      },
      {
        name: 'cinema',
        tagKey: 'amenity',
        tagValue: 'cinema',
      },
      {
        name: 'theatre',
        tagKey: 'amenity',
        tagValue: 'theatre',
      },
    ],
  },
  // Gesundheit + Medizin
  {
    name: 'healthcare',
    color: '#7570b3',
    icon: '',
    categories: [],
  },
  // Nahverkehr + Mobilität
  {
    name: 'mobility', // TODO: change to transport (?)
    color: '#e7298a',
    icon: '',
    categories: [],
  },
  // Naherholung + Natur
  {
    name: 'nature',
    color: '#66a61e',
    icon: '',
    categories: [],
  },
  // Nahversorgung + Dienstleistungen
  {
    name: 'daily needs',
    color: '#e6ab02',
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
      {
        name: 'butcher',
        tagKey: 'shop',
        tagValue: 'butcher',
      },
      {
        name: 'drugstore',
        tagKey: 'shop',
        tagValue: 'chemist',
      },
      {
        name: 'hairdresser',
        tagKey: 'shop',
        tagValue: 'hairdresser',
      },
      {
        name: 'bank',
        tagKey: 'amenity',
        tagValue: 'bank',
      },
    ],
  },
  // TODO: maybe add a grouping for 'work'?
]
