import { defineToolbarApp } from 'astro/toolbar'
import {Footprint} from "@grantcodes/footprint"

const footprint = new Footprint(performance)

footprint.ignored = [
  /\/node_modules\/astro/,
  /\/node_modules\/vite/,
  /\/node_modules\/.vite/,
  /\/@vite\/client/,
  /\/@id\/astro/,
  /\/toolbar\/*/,
]
class AstroCo2 extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  async connectedCallback() {
    const allResources = footprint.resources
    const totalCo2 = allResources.totalCo2

    const htmlResources = footprint.getByCategory('html')
    const cssResources = footprint.getByCategory('css')
    const jsResources = footprint.getByCategory('js')
    const imageResources = footprint.getByCategory('media')
    const otherResources = footprint.getByCategory('other')
    const categories = [
      { name: 'HTML',description: 'The base html document', resources: htmlResources },
      { name: 'CSS',description: 'First and 3rd party CSS loaded on th`is page', resources: cssResources },
      { name: 'JavaScript',description: 'First and 3rd party JavaScript loaded on this page', resources: jsResources },
      { name: 'Images',description: 'Images loaded on this page', resources: imageResources },
      { name: 'Other',description: 'Everything else, and anything this tool failed to recognize', resources: otherResources },
    ]

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          overflow: auto;
        }

        h2 {
          margin-block-start: 0;
        }

        details {
          margin-block-end: .2em;
        }
        details[open] {
          border-block-end: 1px solid rgba(200, 200, 200, .1);
        }

        summary {
          display: flex;
          font-weight: bold;
          flex-direction: row;
          flex-wrap: wrap;
          cursor: pointer;
          padding-block-end: .2em;
          border-block-end: 1px solid rgba(200, 200, 200, .1);
        }

        summary::before {
          content: '▼';
          margin-inline-end: .5em;
          transform: rotate(-90deg);
          transition: transform .2s;
        }
        details[open] summary::before {
          transform: rotate(0deg);
        }

        summary .amount {
          margin-inline-start: auto;
        }

        table {
          padding-block: .5em;
          width: 100%;
        }
        
        th {
          text-align: left;
        }

        td {
          padding: 2px;
        }

        .amount {
          text-align: right;
          font-family: monospace;
        }
        th.amount {
          font-family: inherit;
        }
       
        .warning {
          color: #f00;
        }
      </style>
        <h2>Page total CO2 ${totalCo2.toFixed(3)}g</h2>
        ${categories
          .filter((category) => category.resources.totalCo2 > 0)
          .map(
            (category) => `
              <details>
                <summary>
                  <span class="category">
                    ${category.name}
                  </span>
                  <span class="amount">
                    ${category.resources.totalCo2.toFixed(3)}g
                  </span>
                </summary>
                <table>
                  <thead>
                    <tr>
                      <th>Resource</th>
                      <th class="amount">Size</th>
                      <th class="amount">CO2</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${category.resources
                      .map(
                        (resource) => `
                      <tr class="${resource.co2 > 1 ? 'warning' : ''}">
                        <td>${resource.name.replace(
                          window.location.origin,
                          ''
                        )}</td>
                        <td class="amount">${resource.sizeString} ${
                          resource.isEstimated ? `(estimate)` : ''
                        }</td>
                        <td class="amount">${resource.co2.toFixed(3)}g</td>
                      </tr>
                    `
                      )
                      .join('')}
                  </tbody>
                </table>
              </details>
            `
          )
          .join('')}
    `
  }
}

window.customElements.define('astro-co2', AstroCo2)

export default defineToolbarApp({
  init(canvas, app, server) {
    const load = () => {
      // Add the UI.
      const container = document.createElement('astro-dev-toolbar-window')
      const astroCo2 = document.createElement('astro-co2')
      container.appendChild(astroCo2)
      canvas.append(container)

      // Check the total CO2 and show any warnings.
      const totalCo2 = footprint.resources.totalCo2
      if (totalCo2 > 1) {
        app.toggleNotification({
          state: true,
          level: 'warning',
        })
      }
    }

    // Load the UI when the page is loaded.
    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', () => setTimeout(load, 3000))
    } else {
      setTimeout(load, 3000)
    }
  },
})
