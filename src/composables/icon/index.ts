// Globally import all icons from the icons directory
const data = import.meta.glob('@/assets/icons/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
})

/**
 * A record to store the imported icons with their names as keys.
 */
const icons: Record<string, string> = {}

for (const path in data) {
  const name = path.split('/').pop()?.replace('.svg', '') ?? path
  icons[name] = String(data[path])
}

/**
 * Get the SVG icon by name and apply the specified color to its fill and stroke attributes.
 * @param name - The name of the icon to retrieve.
 * @param color - The color to apply to the icon's fill and stroke attributes.
 * @returns The SVG string of the icon with the applied color.
 */
function getIcon(name: string, color?: string) {
  const icon = icons[name]
  if (!icon) throw new Error(`Icon not found: ${name}`)
  if (!color) return icon
  return icon.replace(/(fill|stroke)="(?!none)[^"]*"/g, `$1="${color}"`)
}

/**
 * Get the data URL of the SVG icon by name, optionally applying a color.
 * @param name - The name of the icon to retrieve.
 * @param color - Optional color to apply to the icon's fill and stroke attributes.
 * @returns The data URL of the SVG icon.
 */
function getUrl(name: string, color?: string) {
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(getIcon(name, color))))}`
}

export function useIcon() {
  return {
    getIcon,
    getUrl,
    names: Object.keys(icons),
  }
}
