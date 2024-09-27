import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import type { AstroIntegration } from 'astro'
import { loadEnv } from 'vite'
import { envDefaults } from '../env-defaults.ts'

// Manually load the environment variables since this is a config file.
const {
  META_TITLE_TEMPLATE = envDefaults.META_TITLE_TEMPLATE,
  OG_IMAGE_BACKGROUND_COLOR = envDefaults.OG_IMAGE_BACKGROUND_COLOR,
  OG_IMAGE_COLOR = envDefaults.OG_IMAGE_COLOR,
  OG_IMAGE_FONT_NAME = envDefaults.OG_IMAGE_FONT_NAME,
  OG_IMAGE_FONT_FILE = envDefaults.OG_IMAGE_FONT_FILE,
} = loadEnv(process.env.NODE_ENV, process.cwd(), '')
const defaultTitleTemplate = META_TITLE_TEMPLATE

// Load the favicon and font files.
const favicon = readFileSync('./public/favicon.svg')
const font = readFileSync(OG_IMAGE_FONT_FILE)

const render = (title: string, description?: string) => ({
  type: 'div',
  props: {
    style: {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      color: OG_IMAGE_COLOR,
      backgroundColor: OG_IMAGE_BACKGROUND_COLOR,
      padding: '55px 70px',
      fontFamily: OG_IMAGE_FONT_NAME,
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
            const html = readFileSync(route.distURL ?? '', {
              encoding: 'utf-8',
            })

            // If the OG image meta tag is not found, do not generate an image.
            const ogMetaQuery = html
              .toString()
              .match(/<meta property="og:image" content="(.*?)"/)
            if (!ogMetaQuery) {
              continue
            }

            // If there is already an existing OG image, do not overwrite it.
            if (
              existsSync(route.distURL.pathname.replace('index.html', 'og.png'))
            ) {
              continue
            }

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
                  name: OG_IMAGE_FONT_NAME,
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

            writeFileSync(
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
