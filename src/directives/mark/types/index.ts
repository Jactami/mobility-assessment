import type Mark from 'mark.js'

export interface MarkedHTMLElement extends HTMLElement {
  __markInstance__?: Mark
  __highlightFn__?: (keyword: string) => void
}
