import type { LocationFactor } from './types'

// Colors are taken from ColorBrewer's Dark2 scheme:
// https://colorbrewer2.org/#type=qualitative&scheme=Dark2&n=6

export const factorConfig: readonly LocationFactor[] = [
  // Bildung + Erziehung
  {
    name: 'education',
    color: '#1b9e77',
    categories: [
      {
        name: 'school',
        tags: [
          { key: 'amenity', value: 'school' },
          { key: 'education', value: 'school' },
        ],
        saturation: 2,
      },
      {
        name: 'university',
        tags: [
          { key: 'amenity', value: 'university' },
          { key: 'education', value: 'university' },
        ],
        saturation: 1,
      },
      {
        name: 'kindergarten',
        tags: [
          { key: 'amenity', value: 'kindergarten' },
          { key: 'education', value: 'kindergarten' },
          { key: 'amenity', value: 'childcare' },
          { key: 'amenity', value: 'preschool' }, // Deprecated, but still might be used
        ],
        saturation: 3,
      },
      {
        name: 'library',
        tags: [{ key: 'amenity', value: 'library' }],
        saturation: 1,
      },
    ],
  },
  // Freizeit + Unterhaltung
  {
    name: 'leisure',
    color: '#d95f02',
    categories: [
      {
        name: 'restaurant',
        tags: [{ key: 'amenity', value: 'restaurant' }],
        saturation: 4,
      },
      {
        name: 'cafe',
        tags: [{ key: 'amenity', value: 'cafe' }],
        saturation: 3,
      },
      {
        name: 'bar',
        tags: [{ key: 'amenity', value: 'bar' }],
        saturation: 3,
      },
      {
        name: 'cinema',
        tags: [{ key: 'amenity', value: 'cinema' }],
        saturation: 1,
      },
      {
        name: 'theatre',
        tags: [{ key: 'amenity', value: 'theatre' }],
        saturation: 1,
      },
      {
        name: 'gym',
        tags: [{ key: 'leisure', value: 'fitness_centre' }],
        saturation: 2,
      },
      {
        // TODO: handle different types of pitches (e.g. football, basketball)
        name: 'pitch',
        tags: [{ key: 'leisure', value: 'pitch' }],
        labelRules: [
          {
            matches: [{ key: 'sport', value: 'soccer' }],
            label: 'Fußballplatz',
          },
          {
            matches: [{ key: 'sport', value: 'basketball' }],
            label: 'Basketballplatz',
          },
          {
            matches: [{ key: 'sport', value: 'tennis' }],
            label: 'Tennisplatz',
          },
          {
            matches: [{ key: 'sport', value: 'table_tennis' }],
            label: 'Tischtennisplatte',
          },
          {
            matches: [{ key: 'sport', value: 'volleyball' }],
            label: 'Volleyballplatz',
          },
          {
            matches: [{ key: 'sport', value: 'beachvolleyball' }],
            label: 'Beachvolleyballplatz',
          },
          {
            matches: [{ key: 'sport', value: 'baseball' }],
            label: 'Baseballplatz',
          },
          {
            matches: [{ key: 'sport', value: 'climbing_adventure' }],
            label: 'Kletterpark',
          },
          {
            matches: [{ key: 'sport', value: 'golf' }],
            label: 'Golfplatz',
          },
          {
            matches: [{ key: 'sport', value: 'skateboard' }],
            label: 'Skatepark',
          },
          {
            matches: [{ key: 'sport', value: 'multi' }],
            label: 'Mehrzweckplatz',
          },
          // TODO: To be continued...
        ],
        saturation: 5,
      },
      {
        name: 'swimming',
        tags: [
          { key: 'leisure', value: 'swimming_area' },
          { key: 'leisure', value: 'water_park' },
          { key: 'leisure', value: 'bathing_place' },
          { key: 'amenity', value: 'public_bath' },
        ],
        saturation: 1,
      },
    ],
  },
  // Gesundheit + Medizin
  {
    name: 'health',
    color: '#7570b3',
    categories: [
      {
        name: 'hospital',
        tags: [{ key: 'amenity', value: 'hospital' }],
        saturation: 1,
      },
      {
        name: 'doctor',
        tags: [
          { key: 'amenity', value: 'doctors' },
          { key: 'amenity', value: 'clinic' }, // multiple doctors in one place
        ],
        saturation: 3,
      },
      {
        name: 'pharmacy',
        tags: [{ key: 'amenity', value: 'pharmacy' }],
        saturation: 2,
      },
      {
        name: 'dentist',
        tags: [{ key: 'amenity', value: 'dentist' }],
        saturation: 2,
      },
      {
        name: 'care',
        tags: [
          // TODO: Decide whether to use explicit tags or rely on 'social_facility:for=senior'
          // { key: 'amenity', value: 'retirement_home' },
          // { key: 'social_facility', value: 'nursing_home' },
          // { key: 'social_facility', value: 'group_home' },
          // { key: 'social_facility', value: 'assisted_living' },
          // { key: 'social_facility', value: 'day_care' },
          { key: 'social_facility:for', value: 'senior' },
        ],
        saturation: 1,
      },
    ],
  },
  // Verkehr + Mobilität
  {
    name: 'mobility',
    color: '#e7298a',
    categories: [
      {
        // TODO: add: railway and tram
        name: 'station',
        tags: [
          { key: 'highway', value: 'bus_stop' },
          { key: 'amenity', value: 'bus_station' }, // larger bus stops (ZOB)
          { key: 'railway', value: 'station' },
          { key: 'railway', value: 'halt' },
          { key: 'railway', value: 'tram_stop' },
        ],
        labelRules: [
          {
            matches: [{ key: 'highway', value: 'bus_stop' }],
            prefix: 'Bushaltestelle',
          },
          {
            matches: [{ key: 'amenity', value: 'bus_station' }],
            prefix: 'Busbahnhof',
          },
          {
            matches: [{ key: 'station', value: 'subway' }],
            prefix: 'U-Bahn-Station',
          },
          {
            matches: [
              { key: 'railway', value: 'station' },
              { key: 'railway', value: 'halt' },
            ],
            prefix: 'Bahnhof',
          },
          {
            matches: [{ key: 'railway', value: 'tram_stop' }],
            prefix: 'Straßenbahnhaltestelle',
          },
        ],
        saturation: 6,
      },
      {
        name: 'bicycle',
        tags: [{ key: 'amenity', value: 'bicycle_rental' }],
        saturation: 1,
      },
      {
        name: 'car',
        tags: [{ key: 'amenity', value: 'car_sharing' }],
        labelRules: [
          {
            matches: [{ key: 'amenity', value: 'car_sharing' }],
            fallback: 'operator',
          },
        ],
        saturation: 1,
      },
      {
        name: 'taxi',
        tags: [{ key: 'amenity', value: 'taxi' }],
        saturation: 1,
      },
    ],
  },
  // Naherholung + Natur
  {
    name: 'recreation',
    color: '#66a61e',
    categories: [
      {
        name: 'park',
        tags: [{ key: 'leisure', value: 'park' }],
        saturation: 3,
      },
      {
        name: 'playground',
        tags: [{ key: 'leisure', value: 'playground' }],
        saturation: 3,
      },
      {
        name: 'forest',
        tags: [
          { key: 'landuse', value: 'forest' },
          { key: 'natural', value: 'wood' },
        ],
        saturation: 2,
      },
    ],
  },
  // Nahversorgung + Dienstleistungen
  {
    name: 'supply',
    color: '#e6ab02',
    categories: [
      {
        name: 'supermarket',
        tags: [{ key: 'shop', value: 'supermarket' }],
        saturation: 4,
      },
      {
        name: 'bakery',
        tags: [{ key: 'shop', value: 'bakery' }],
        saturation: 3,
      },
      {
        name: 'butcher',
        tags: [{ key: 'shop', value: 'butcher' }],
        saturation: 2,
      },
      {
        name: 'drugstore',
        tags: [{ key: 'shop', value: 'chemist' }],
        saturation: 2,
      },
      {
        name: 'clothing',
        tags: [{ key: 'shop', value: 'clothes' }],
        saturation: 2,
      },
      {
        name: 'hairdresser',
        tags: [{ key: 'shop', value: 'hairdresser' }],
        saturation: 2,
      },
      {
        name: 'bank',
        tags: [{ key: 'amenity', value: 'bank' }],
        saturation: 2,
      },
      {
        name: 'atm',
        tags: [
          { key: 'amenity', value: 'atm' },
          { key: 'atm', value: 'yes' },
        ],
        saturation: 3,
      },
      {
        name: 'post',
        tags: [
          { key: 'amenity', value: 'post_office' },
          { key: 'amenity', value: 'parcel_locker' },
          { key: 'post_office', value: 'post_partner' },
          // TODO: add post_boxes (?)
        ],
        saturation: 2,
      },
    ],
  },
]
