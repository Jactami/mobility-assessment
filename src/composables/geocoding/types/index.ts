// https://nominatim.org/release-docs/latest/api/Output/#geocodejson
export interface GeocodeJSON {
  type: 'FeatureCollection'
  features: GeocodeJSONFeature[]
  geocoding: {
    version: string
    licence?: string | Record<string, string> | null
    attribution?: string | Record<string, string> | null
    query?: string | null
  }
}

export interface GeocodeJSONFeature {
  type: 'Feature'
  geometry: GeoJSONGeometry
  properties: {
    geocoding: GeocodeJSONProperties
  }
}

export interface GeoJSONGeometry {
  type: 'Point' // | 'Polygon' | 'MultiPolygon'
  coordinates: number[] // | number[][] | number[][][]
}

export interface GeocodeJSONProperties {
  // OSM core references
  osm_type?: 'node' | 'way' | 'relation'
  osm_id?: number
  place_id?: number

  // Core descriptive properties
  type?: 'house' | 'street' | 'district' | 'city' | 'county' | 'state' | 'country' | 'locality'
  osm_key?: string
  osm_value?: string

  // Human-readable labels
  label: string
  name?: string

  // Address breakdown (Important: You have to set 'addressdetails=1' in the request!)
  housenumber?: string
  street?: string
  locality?: string
  district?: string
  postcode?: string
  city?: string
  county?: string
  state?: string
  country?: string

  // Optional administrative hierarchy
  admin?: Record<string, string>
}

/**
 * Represents a structured address object.
 * It is used to process and transform geocodes from Nominatim into a more manageable format.
 */
export interface Address {
  latitude: number
  longitude: number
  housenumber?: string
  street?: string
  postcode?: string
  city?: string
  country?: string
}
