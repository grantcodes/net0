import { defineToolbarApp } from 'astro/toolbar'
import { getPageCo2 } from './page-co2'

const IGNORED_RESOURCES = [
  /\/node_modules\/astro/,
  /\/node_modules\/vite/,
  /\/node_modules\/.vite/,
  /\/@vite\/client/,
  /\/@id\/astro/,
  /\/toolbar\/app.ts/,
]

export default defineToolbarApp({
  init(canvas, app, server) {
    const pageCo2 = getPageCo2()

    const container = document.createElement('astro-dev-toolbar-window')

    const dl = document.createElement('dl')
    dl.style.margin = '0'

    for (const category of pageCo2) {
      const dt = document.createElement('dt')
      dt.textContent = category.name
      dl.append(dt)
      const dd = document.createElement('dd')
      dd.textContent = `${category.totalCo2} g`
      dl.append(dd)

      const details = document.createElement('details')
      dl.append(details)

      const summary = document.createElement('summary')
      summary.textContent = 'Details'

      details.append(summary)

      const table = document.createElement('table')
      details.append(table)

      table.innerHTML = `
        <thead>
          <tr>
            <th>Resource</th>
            <th>Size</th>
          </tr>
        </thead>
        <tbody>
          ${category.resources
            .map((resource) => {
              return `
              <tr>
                <td>${resource.name}</td>
                <td>${resource.bytes.toFixed(2)} bytes</td>
              </tr>
            `
            })
            .join('')}
        </tbody>
       `
    }

    container.append(dl)

    canvas.append(container)
  },
})
