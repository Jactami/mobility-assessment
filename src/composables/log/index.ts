import type { LogType } from './types'

const logMap: Record<LogType, string> = {
  log: 'LOG',
  error: 'ERROR',
}

export function useLogger(module = '') {
  const modulePrefix = module ? ` :: ${module}` : ''

  const logMessage = (type: LogType = 'log', ...message: unknown[]) => {
    if (import.meta.env.PROD) {
      return
    }

    const logType = logMap[type]
    const timestamp = new Date().toLocaleString()

    console[type](`[${logType}] ${timestamp}${modulePrefix}\n→`, ...message)
  }

  const log = (...message: unknown[]) => {
    logMessage('log', ...message)
  }

  const error = (...message: unknown[]) => {
    logMessage('error', ...message)
  }

  return { log, error }
}
