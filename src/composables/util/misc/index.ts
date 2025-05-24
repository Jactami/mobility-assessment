export function useUtil() {
  return { sleep }
}

/**
 * Sleep for a specified number of milliseconds.
 * @param milliseconds - The number of milliseconds to sleep.
 * @returns - A promise that resolves after the specified number of milliseconds.
 */
function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}
