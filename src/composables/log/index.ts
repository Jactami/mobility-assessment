const logTypes = ['log', 'info', 'debug', 'warn', 'error'] as const

type LogType = (typeof logTypes)[number]

export function useLogger(module = '') {
  const modulePrefix = module ? ` :: ${module}` : ''

  const logMessage = (type: LogType = 'log', ...message: unknown[]) => {
    if (import.meta.env.PROD) {
      return
    }

    const logType = type.toUpperCase()
    const timestamp = new Date().toLocaleString()

    console[type](`[${logType}] ${timestamp}${modulePrefix}\n→`, ...message)
  }

  const logger = {} as Record<LogType, (...message: unknown[]) => void>

  logTypes.forEach((type) => {
    logger[type] = (...message: unknown[]) => logMessage(type, ...message)
  })

  return logger
}
