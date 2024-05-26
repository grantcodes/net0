import { co2 } from '@tgwf/co2'

type ResourceCategoryId = 'media' | 'js' | 'css' | 'html' | 'other'

const IGNORED_RESOURCES = [
  /\/node_modules\/astro/,
  /\/node_modules\/vite/,
  /\/node_modules\/.vite/,
  /\/@vite\/client/,
  /\/@id\/astro/,
  /\/toolbar\/app.ts/,
]

const co2Emission = new co2()

class Resource {
  name: string
  bytes: number
  duration: number

  constructor(entry: PerformanceResourceTiming | PerformanceNavigationTiming) {
    this.name = entry.name
    this.bytes = entry.encodedBodySize
    this.duration = entry.duration
  }

  get isExternal() {
    return !this.name.startsWith(location.origin)
  }

  get co2(): number {
    return co2Emission.perByte(this.bytes, true)
  }
}

class ResourceCategory {
  id: ResourceCategoryId
  name: string
  description: string
  _resources: Resource[] = []

  constructor(id: ResourceCategoryId, name: string, description: string) {
    this.id = id
    this.name = name
    this.description = description
  }

  addEntry(entry: PerformanceResourceTiming | PerformanceNavigationTiming) {
    // Ignore if no encodedBodySize
    if (!entry.encodedBodySize) {
      return
    }
    // Ignore if already in resources
    if (this._resources.some((resource) => resource.name === entry.name)) {
      return
    }

    // Add to the resources array
    this.resources.push(new Resource(entry))
  }

  get resources(): Resource[] {
    // Sort resources by co2 emission
    return this._resources.sort((a, b) => b.co2 - a.co2)
  }

  get totalBytes(): number {
    return this.resources.reduce((total, resource) => total + resource.bytes, 0)
  }

  get totalDuration(): number {
    return this.resources.reduce(
      (total, resource) => total + resource.duration,
      0
    )
  }

  get totalCo2(): number {
    return this.resources.reduce((total, resource) => total + resource.co2, 0)
  }
}

const baseResources: ResourceCategory[] = [
  new ResourceCategory('html', 'HTML', 'The base html document'),
  new ResourceCategory(
    'js',
    'JavaScript',
    'First and third party JavaScript loaded on this page'
  ),
  new ResourceCategory(
    'css',
    'CSS',
    'First and third party CSS styles loaded on this page'
  ),
  new ResourceCategory(
    'media',
    'Media',
    'All images, video and audio loaded on this page'
  ),
  new ResourceCategory(
    'other',
    'Other',
    'Everything else and things this tool failed to categorize'
  ),
]

function getPerformanceEntryResouceCategory(
  entry: PerformanceEntry
): ResourceCategoryId {
  let category: ResourceCategoryId = 'other'

  const fileExtension = entry.name.includes('.')
    ? entry.name.split('.').pop()
    : ''

  // Sometimes CSS loadeitem.encodedBodySize.average.valued by JS is detected as a script
  if (['css', 'scss', 'sass', 'less'].includes(fileExtension)) {
    category = 'css'
  }

  if (
    ['js', 'mjs', 'jsx', 'ts', 'tsx', 'cjs', 'vue', 'svelte'].includes(
      fileExtension
    )
  ) {
    category = 'js'
  }

  if (
    ['svg', 'jpg', 'webp', 'avif', 'mp4', 'png', 'gif'].includes(fileExtension)
  ) {
    category = 'media'
  }

  if (entry.entryType === 'navigation') {
    category = 'html'
  }

  return category
}

function getPerformanceResources(): ResourceCategory[] {
  const resourceCategories = baseResources

  // Get all performance entries
  const performanceEntries = performance.getEntries()

  for (const entry of performanceEntries) {
    // We only want a couple of sub types of entries.
    if (
      !(entry instanceof PerformanceResourceTiming) &&
      !(entry instanceof PerformanceNavigationTiming)
    ) {
      continue
    }

    // Do not include resources from Astro's node_modules
    if (IGNORED_RESOURCES.some((ignored) => entry.name.match(ignored))) {
      continue
    }

    // Get the category for this entry
    const category = getPerformanceEntryResouceCategory(entry)
    const resourceCategory = resourceCategories.find((c) => c.id === category)

    resourceCategory.addEntry(entry)
  }

  return resourceCategories
}

export { getPerformanceResources as getPageCo2 }
