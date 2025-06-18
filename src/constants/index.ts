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
        tags: [{ key: 'amenity', value: 'school' }],
      },
      {
        name: 'university',
        tags: [{ key: 'amenity', value: 'university' }],
      },
      {
        // TODO: Decide if also include amenity=childcare
        name: 'kindergarten',
        tags: [{ key: 'amenity', value: 'kindergarten' }],
      },
      {
        name: 'library',
        tags: [{ key: 'amenity', value: 'library' }],
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
        tags: [{ key: 'amenity', value: 'restaurant' }],
      },
      {
        name: 'cafe',
        tags: [{ key: 'amenity', value: 'cafe' }],
      },
      {
        name: 'bar',
        tags: [{ key: 'amenity', value: 'bar' }],
      },
      {
        name: 'cinema',
        tags: [{ key: 'amenity', value: 'cinema' }],
      },
      {
        name: 'theatre',
        tags: [{ key: 'amenity', value: 'theatre' }],
      },
      {
        name: 'gym',
        tags: [{ key: 'leisure', value: 'fitness_centre' }],
      },
      {
        // TODO: handle different types of pitches (e.g. football, basketball)
        name: 'pitch',
        tags: [{ key: 'leisure', value: 'pitch' }],
      },
      {
        // TODO: also handle leisure=bathing_place, amenity=public_bath, leisure=water_park
        name: 'swimming',
        tags: [{ key: 'leisure', value: 'swimming_area' }],
      },
    ],
  },
  // Gesundheit + Medizin
  {
    name: 'health',
    color: '#7570b3',
    icon: '',
    categories: [
      {
        name: 'hospital',
        tags: [{ key: 'amenity', value: 'hospital' }],
      },
      {
        name: 'doctor',
        tags: [{ key: 'amenity', value: 'doctors' }],
      },
      {
        name: 'pharmacy',
        tags: [{ key: 'amenity', value: 'pharmacy' }],
      },
      {
        name: 'dentist',
        tags: [{ key: 'amenity', value: 'dentist' }],
      },
      {
        // TODO: add social_facility=assisted_living, social_facility=day_care
        name: 'care',
        tags: [{ key: 'amenity', value: 'nursing_home' }],
      },
    ],
  },
  // Nahverkehr + Mobilität
  {
    name: 'mobility', // TODO: change to transport (?)
    color: '#e7298a',
    icon: '',
    categories: [
      {
        // TODO: add: railway and tram
        name: 'publicTransport',
        tags: [{ key: 'highway', value: 'bus_stop' }], // TODO: also bus_station?
      },
      {
        name: 'bicycle',
        tags: [{ key: 'amenity', value: 'bicycle_rental' }],
      },
      {
        name: 'car',
        tags: [{ key: 'amenity', value: 'car_rental' }],
      },
      {
        name: 'taxi',
        tags: [{ key: 'amenity', value: 'taxi' }],
      },
    ],
  },
  // Naherholung + Natur
  {
    name: 'recreation',
    color: '#66a61e',
    icon: '',
    categories: [
      {
        name: 'park',
        tags: [{ key: 'leisure', value: 'park' }],
      },
      {
        name: 'playground',
        tags: [{ key: 'leisure', value: 'playground' }],
      },
      {
        // TODO: natural=wood might also be fitting here
        name: 'forest',
        tags: [{ key: 'landuse', value: 'forest' }],
      },
    ],
  },
  // Nahversorgung + Dienstleistungen
  {
    name: 'supply',
    color: '#e6ab02',
    icon: '',
    categories: [
      {
        name: 'supermarket',
        tags: [{ key: 'shop', value: 'supermarket' }],
      },
      {
        name: 'bakery',
        tags: [{ key: 'shop', value: 'bakery' }],
      },
      {
        name: 'butcher',
        tags: [{ key: 'shop', value: 'butcher' }],
      },
      {
        name: 'drugstore',
        tags: [{ key: 'shop', value: 'chemist' }],
      },
      {
        name: 'clothing',
        tags: [{ key: 'shop', value: 'clothes' }],
      },
      {
        name: 'hairdresser',
        tags: [{ key: 'shop', value: 'hairdresser' }],
      },
      {
        name: 'bank',
        tags: [{ key: 'amenity', value: 'bank' }],
      },
      {
        name: 'atm',
        tags: [{ key: 'amenity', value: 'atm' }],
      },
      {
        // TODO: also add amenity=parcel_locker, post_office=post_partner
        name: 'post',
        tags: [{ key: 'amenity', value: 'post_office' }],
      },
    ],
  },
  // TODO: maybe add a grouping for 'work'?
]
