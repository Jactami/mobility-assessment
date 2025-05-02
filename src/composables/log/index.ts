import type { LogType } from './types'

const logMap: Record<LogType, string> = {
  log: '[LOG]',
  error: '[ERROR]',
}

const logMessage = (type: LogType = 'log', ...message: unknown[]) => {
  if (import.meta.env.PROD) {
    return
  }
  console[type](`${logMap[type]} ${new Date().toISOString()}:\n`, ...message)
}

const log = (...message: unknown[]) => {
  logMessage('log', ...message)
}

const error = (...message: unknown[]) => {
  logMessage('error', ...message)
}

export function useLogger() {
  return { log, error }
}
