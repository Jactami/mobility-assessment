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
        // TODO: Decide if also include amenity=childcare
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
      {
        name: 'gym',
        tagKey: 'leisure',
        tagValue: 'fitness_centre',
      },
      {
        // TODO: handle different types of pitches (e.g. football, basketball)
        name: 'pitch',
        tagKey: 'leisure',
        tagValue: 'pitch',
      },
      {
        // TODO: also handle leisure=bathing_place, amenity=public_bath, leisure=water_park
        name: 'swimming',
        tagKey: 'leisure',
        tagValue: 'swimming_area',
      },
    ],
  },
  // Gesundheit + Medizin
  {
    name: 'healthcare',
    color: '#7570b3',
    icon: '',
    categories: [
      {
        name: 'hospital',
        tagKey: 'amenity',
        tagValue: 'hospital',
      },
      {
        name: 'doctor',
        tagKey: 'amenity',
        tagValue: 'doctors',
      },
      {
        name: 'pharmacy',
        tagKey: 'amenity',
        tagValue: 'pharmacy',
      },
      {
        name: 'dentist',
        tagKey: 'amenity',
        tagValue: 'dentist',
      },
      {
        // TODO: add social_facility=assisted_living, social_facility=day_care
        name: 'care',
        tagKey: 'amenity',
        tagValue: 'nursing_home',
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
        tagKey: 'highway',
        tagValue: 'bus_stop', // TODO: also bus_station?
      },
      {
        name: 'bicycle',
        tagKey: 'amenity',
        tagValue: 'bicycle_rental',
      },
      {
        name: 'car',
        tagKey: 'amenity',
        tagValue: 'car_rental',
      },
      {
        name: 'taxi',
        tagKey: 'amenity',
        tagValue: 'taxi',
      },
    ],
  },
  // Naherholung + Natur
  {
    name: 'nature',
    color: '#66a61e',
    icon: '',
    categories: [
      {
        name: 'park',
        tagKey: 'leisure',
        tagValue: 'park',
      },
      {
        name: 'playground',
        tagKey: 'leisure',
        tagValue: 'playground',
      },
      {
        // TODO: natural=wood might also be fitting here
        name: 'forest',
        tagKey: 'landuse',
        tagValue: 'forest',
      },
    ],
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
        name: 'clothing',
        tagKey: 'shop',
        tagValue: 'clothes',
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
      {
        name: 'atm',
        tagKey: 'amenity',
        tagValue: 'atm',
      },
      {
        // TODO: also add amenity=parcel_locker, post_office=post_partner
        name: 'post',
        tagKey: 'amenity',
        tagValue: 'post_office',
      },
    ],
  },
  // TODO: maybe add a grouping for 'work'?
]
