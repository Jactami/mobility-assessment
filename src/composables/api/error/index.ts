export class ServiceError extends Error {
  public readonly service: string
  public readonly code?: number

  constructor(service: string, message: string, code?: number) {
    super(`[${service}] ${message}` + (code ? ` (${code})` : ''))
    this.name = 'ServiceError'

    this.service = service
    this.code = code
  }
}
