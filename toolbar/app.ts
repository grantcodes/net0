import { defineToolbarApp } from 'astro/toolbar'
import { co2 } from '@tgwf/co2'

const IGNORED_RESOURCES = ['/node_modules/astro', '/@vite/client', '/@id/astro']

// Thanks https://stackoverflow.com/a/75766644
function getPerformanceResources() {
  // Get all performance entries
  var perf = performance.getEntries()
  // Create an empty object to store resource information
  var resources = {}

  // Iterate through each performance entry
  perf.forEach(function (entry) {
    // Get the initiator type or entry type as the resource type (unit: string)
    var type = entry.initiatorType || entry.entryType

    // Do not include resources from Astro's node_modules
    if (IGNORED_RESOURCES.some((ignored) => entry.name.includes(ignored))) {
      return
    }

    // If the resource type is not in the resources object, initialize it with default values
    if (!resources[type]) {
      resources[type] = {
        count: 0, // Unit: count of resources (integer)
        encodedBodySize: {},
        decodedBodySize: {},
        duration: {},
        names: [], // Unit: array of resource names (strings)
      }
    }

    // Reference the resource object for the current resource type
    var resource = resources[type]
    // Increment the resource count
    resource.count++

    // Add the resource name to the names array
    resource.names.push(entry.name)

    // Iterate through each required metric (encodedBodySize, decodedBodySize, duration)
    ;['encodedBodySize', 'decodedBodySize', 'duration'].forEach(function (
      metric
    ) {
      // Get the value for the current metric
      // encodedBodySize and decodedBodySize units: bytes (integer)
      // duration unit: milliseconds (float)
      var value = entry[metric]

      // Initialize the total object for the current metric if it doesn't exist
      if (!resource[metric].total) {
        resource[metric].total = { value: 0, count: 0 }
      }
      // Increment the total value and count for the current metric
      resource[metric].total.value += value
      resource[metric].total.count++

      // Iterate through each required statistic (minimum, minimum_excluding_0, maximum, average)
      ;['minimum', 'minimum_excluding_0', 'maximum', 'average'].forEach(
        function (stat) {
          // Initialize the stat object for the current metric if it doesn't exist
          if (!resource[metric][stat]) {
            resource[metric][stat] = { value: 0, count: 0, names: [] }
          }
        }
      )

      // If the value is 0, update the minimum statistic for the current metric
      if (value === 0) {
        resource[metric].minimum.value = 0
        resource[metric].minimum.count++
        resource[metric].minimum.names.push(entry.name)
      } else if (value > 0) {
        // If the value is greater than 0, update other statistics for the current metric
        // Update the minimum_excluding_0 statistic if it's the first occurrence or the value is lower than the current minimum
        if (
          resource[metric].minimum_excluding_0.value === 0 ||
          value < resource[metric].minimum_excluding_0.value
        ) {
          resource[metric].minimum_excluding_0.value = value
          resource[metric].minimum_excluding_0.count = 1
          resource[metric].minimum_excluding_0.names = [entry.name]
        } else if (value === resource[metric].minimum_excluding_0.value) {
          // If the value is equal to the current minimum, increment the count and add the name to the list
          resource[metric].minimum_excluding_0.count++
          resource[metric].minimum_excluding_0.names.push(entry.name)
        }

        // Update the maximum statistic if it's the first occurrence or the value is higher than the current maximum
        if (value > resource[metric].maximum.value) {
          resource[metric].maximum.value = value
          resource[metric].maximum.count = 1
          resource[metric].maximum.names = [entry.name]
        } else if (value === resource[metric].maximum.value) {
          // If the value is equal to the current maximum, increment the count and add the name to the list
          resource[metric].maximum.count++
          resource[metric].maximum.names.push(entry.name)
        }
      }

      // Calculate the average value for the current metric
      resource[metric].average.value =
        resource[metric].total.value / resource[metric].total.count
      resource[metric].average.count = resource[metric].total.count
      resource[metric].average.names = resource.names
    })
  })

  return resources
}

export default defineToolbarApp({
  init(canvas, app, server) {
    const co2Emission = new co2()

    const container = document.createElement('astro-dev-toolbar-window')

    const dl = document.createElement('dl')
    dl.style.margin = '0'

    const performanceResults = getPerformanceResources()

    for (const key in performanceResults) {
      if (Object.prototype.hasOwnProperty.call(performanceResults, key)) {
        const item = performanceResults[key]

        if (item?.encodedBodySize?.total?.value) {
          const itemCo2 = co2Emission
            .perByte(item.encodedBodySize.total.value, true)
            .toFixed(3)

          const dt = document.createElement('dt')
          dt.textContent = key
          dl.append(dt)
          const dd = document.createElement('dd')
          dd.textContent = `${itemCo2} g`
          dl.append(dd)
        }
      }
    }

    container.append(dl)

    canvas.append(container)
  },
})
