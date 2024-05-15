import { co2 } from '@tgwf/co2'

const IGNORED_RESOURCES = [
  /\/node_modules\/astro/,
  /\/node_modules\/vite/,
  /\/node_modules\/.vite/,
  /\/@vite\/client/,
  /\/@id\/astro/,
  /\/toolbar\/app.ts/,
]

type ResourceCategoryId = 'media' | 'js' | 'css' | 'html' | 'other'

interface Resource {
  name: string
  bytes: number
  duration: number
  isExternal: boolean
}

interface ResourceCategory {
  id: ResourceCategoryId
  name: string
  description: string
  totalCo2: number
  totalBytes: number
  totalDuration: number
  resources: Resource[]
}

const baseResources: ResourceCategory[] = [
  {
    id: 'html',
    name: 'HTML',
    description: 'The base html document',
    totalCo2: 0,
    totalBytes: 0,
    totalDuration: 0,
    resources: [],
  },
  {
    id: 'js',
    name: 'JavaScript',
    description: 'First and third party JavaScript loaded on this page',
    totalCo2: 0,
    totalBytes: 0,
    totalDuration: 0,
    resources: [],
  },
  {
    id: 'css',
    name: 'CSS',
    description: 'First and third party CSS styles loaded on this page',
    totalCo2: 0,
    totalBytes: 0,
    totalDuration: 0,
    resources: [],
  },
  {
    id: 'media',
    name: 'Media',
    description: 'All images, video and audio loaded on this page',
    totalCo2: 0,
    totalBytes: 0,
    totalDuration: 0,
    resources: [],
  },
  {
    id: 'other',
    name: 'Other',
    description: 'Everything else and things this tool failed to categorize',
    totalCo2: 0,
    totalBytes: 0,
    totalDuration: 0,
    resources: [],
  },
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
  const co2Emission = new co2()

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

    const entryResouce: Resource = {
      name: entry.name,
      bytes: entry.encodedBodySize,
      duration: entry.duration,
      isExternal: false,
    }

    try {
      const isExternal = new URL(entry.name).hostname !== location.hostname
      entryResouce.isExternal = isExternal
    } catch (err) {
      // Resource name probably isn't a url. Not a big deal, just assume it's internal
    }

    console.log(entry)

    const entryCo2 = co2Emission.perByte(entryResouce.bytes, true)

    resourceCategory.resources.push(entryResouce)
    resourceCategory.totalBytes =
      resourceCategory.totalBytes + entryResouce.bytes
    resourceCategory.totalDuration =
      resourceCategory.totalDuration + entryResouce.duration
    resourceCategory.totalCo2 = resourceCategory.totalCo2 + entryCo2
  }

  return resourceCategories
}

export { getPerformanceResources as getPageCo2 }
