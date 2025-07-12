export function useUtil() {
  return {
    createAddress,
    sleep,
  }
}

/**
 * Sleep for a specified number of milliseconds.
 * @param milliseconds - The number of milliseconds to sleep.
 * @returns - A promise that resolves after the specified number of milliseconds.
 */
function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

/**
 * Create a formatted address string from the given options.
 * @param options - An object containing address components.
 * @returns A formatted address string.
 */
function createAddress(options: {
  name?: string | null
  housenumber?: string | null
  street?: string | null
  postcode?: string | null
  city?: string | null
  country?: string | null
}): string {
  let address = ''

  // Concatenate address components, ensuring proper formatting
  address += options.name ? options.name + ', ' : ''
  address += options.street ? options.street : ''
  address += options.housenumber ? ' ' + options.housenumber + ', ' : ''
  address += options.postcode ? options.postcode + ' ' : ''
  address += options.city ? options.city : ''
  address += options.country ? ', ' + options.country : ''

  // Remove any trailing whitespace
  address = address.trim()

  // Remove trailing comma
  if (address.endsWith(',')) address = address.slice(0, -1)

  return address
}
