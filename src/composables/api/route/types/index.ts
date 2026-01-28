export type OrsResponse = OrsRouteResponse | OrsErrorResponse

export interface OrsErrorResponse {
  error: {
    code: number
    message: string
  }
  info: {
    engine: OrsEngine
  }
  timestamp: number
}
export interface OrsRouteResponse {
  type: 'FeatureCollection'
  bbox: [number, number, number, number]
  features: OrsFeature[]
  metadata: OrsMetadata
}

export interface OrsFeature {
  type: 'Feature'
  bbox: [number, number, number, number]
  properties: OrsFeatureProperties
  geometry: {
    type: 'LineString'
    coordinates: [number, number][]
  }
}

export interface OrsFeatureProperties {
  segments: OrsSegment[]
  summary: {
    distance: number
    duration: number
  }
  way_points: [number, number]
}

export interface OrsSegment {
  distance: number
  duration: number
  steps: OrsStep[]
}

export interface OrsStep {
  distance: number
  duration: number
  type: number
  instruction: string
  name: string
  way_points: [number, number]
}

export interface OrsMetadata {
  attribution: string
  service: string
  timestamp: number
  query: OrsQuery
  engine: OrsEngine
}

export interface OrsQuery {
  coordinates: [number, number][]
  profile: string
  format: string
}

export interface OrsEngine {
  version: string
  build_date: string
  graph_date?: string
}
