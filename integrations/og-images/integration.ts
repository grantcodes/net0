import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { readFile, writeFile } from 'node:fs/promises'
import type { AstroIntegration } from 'astro'
import { META_TITLE_TEMPLATE } from 'astro:env/server'

const defaultTitleTemplate = META_TITLE_TEMPLATE
const favicon = await readFile('./public/favicon.svg')
const font = await readFile(
  './node_modules/@fontsource/lexend/files/lexend-latin-400-normal.woff'
)

const render = (title: string, description?: string) => ({
  type: 'div',
  props: {
    style: {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#13171f',
      padding: '55px 70px',
      color: '#f0f1f3',
      fontFamily: 'Lexend',
      fontSize: 72,
    },
    children: [
      {
        type: 'img',
        props: {
          src: `data:image/svg+xml;base64,${favicon.toString('base64')}`,
          style: {
            width: 60,
            height: 60,
          },
        },
      },
      {
        type: 'div',
        props: {
          style: { marginTop: 96 },
          children: title,
        },
      },
      {
        type: 'div',
        props: {
          style: { marginTop: 30, fontSize: 36 },
          children: description,
        },
      },
    ],
  },
})

export default {
  name: 'net0-og-images',
  hooks: {
    'astro:build:done': async ({ dir, pages, routes }) => {
      try {
        for (const route of routes) {
          // Only generate OG images for index.html pages.
          if (route.distURL?.pathname?.endsWith('index.html') ?? false) {
            // Pull out metadata from the compiled html file
            const html = await readFile(route.distURL ?? '', {
              encoding: 'utf-8',
            })
            const titleQuery = html.toString().match(/<title>(.*?)<\/title>/)
            const descriptionQuery = html
              .toString()
              .match(/<meta name="description" content="(.*?)"/)

            const titleWithTemplate = titleQuery ? titleQuery[1] : ''
            const title = titleWithTemplate.replace(
              defaultTitleTemplate.replace('%s', ''),
              ''
            )
            const description = descriptionQuery ? descriptionQuery[1] : ''

            const svg = await satori(render(title, description), {
              width: 1200,
              height: 630,
              fonts: [
                {
                  name: 'Lexend',
                  data: font,
                  weight: 400,
                  style: 'normal',
                },
              ],
            })

            const resvg = new Resvg(svg, {
              fitTo: {
                mode: 'width',
                value: 1200,
              },
            })

            writeFile(
              route.distURL.pathname.replace('index.html', 'og.png'),
              resvg.render().asPng()
            )
          }
        }
      } catch (e) {
        console.error(e)
        console.log(`\x1b[31mog:\x1b[0m OpenGraph image generation failed\n`)
      }
    },
  },
} satisfies AstroIntegration
