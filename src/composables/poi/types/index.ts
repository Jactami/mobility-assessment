export interface OverpassResponse {
  version: number
  generator: string
  osm3s: {
    timestamp_osm_base: string
    copyright: string
  }
  elements: OverpassElement[]
}

export type OverpassElement = OverpassNode | OverpassWay | OverpassRelation

type OsmType = 'node' | 'way' | 'relation'

interface OverpassElementBase {
  type: OsmType
  id: number
  tags?: OsmTags
}

interface OsmTags {
  name?: string
  // TODO: Define more specific tags as needed
  [key: string]: string | undefined // Capture any additional tags
}

interface LatLon {
  lat: number
  lon: number
}

interface OverpassNode extends OverpassElementBase, LatLon {
  type: 'node'
}

interface OverpassWay extends OverpassElementBase {
  type: 'way'
  nodes: number[]
  center?: LatLon // set 'out center' in the query to get the center point of a way
}

interface OverpassRelation extends OverpassElementBase {
  type: 'relation'
  members: {
    type: OsmType
    ref: number
    role: string
  }[]
  center?: LatLon // set 'out center' in the query to get the center point of a relation
}
