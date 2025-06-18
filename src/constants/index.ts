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
        name: 'kindergarten',
        tags: [
          { key: 'amenity', value: 'kindergarten' },
          { key: 'amenity', value: 'childcare' },
          { key: 'amenity', value: 'preschool' }, // Deprecated, but still might be used
        ],
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
        name: 'swimming',
        tags: [
          { key: 'leisure', value: 'swimming_area' },
          { key: 'leisure', value: 'water_park' },
          { key: 'leisure', value: 'bathing_place' },
          { key: 'amenity', value: 'public_bath' },
        ],
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
        tags: [
          { key: 'amenity', value: 'doctors' },
          { key: 'amenity', value: 'clinic' }, // multiple doctors in one place
        ],
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
        name: 'care',
        tags: [
          { key: 'amenity', value: 'nursing_home' },
          { key: 'social_facility', value: 'assisted_living' },
          { key: 'social_facility', value: 'day_care' },
        ],
      },
    ],
  },
  // Verkehr + Mobilität
  {
    name: 'mobility',
    color: '#e7298a',
    icon: '',
    categories: [
      {
        // TODO: add: railway and tram
        name: 'publicTransport',
        tags: [
          { key: 'highway', value: 'bus_stop' },
          { key: 'amenity', value: 'bus_station' }, // larger bus stops (ZOB)
          { key: 'railway', value: 'station' },
          { key: 'railway', value: 'halt' },
          { key: 'railway', value: 'tram_stop' },
        ],
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
        name: 'forest',
        tags: [
          { key: 'landuse', value: 'forest' },
          { key: 'natural', value: 'wood' },
        ],
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
        name: 'post',
        tags: [
          { key: 'amenity', value: 'post_office' },
          { key: 'amenity', value: 'parcel_locker' },
          { key: 'post_office', value: 'post_partner' },
          // TODO: add post_boxes (?)
        ],
      },
    ],
  },
]
