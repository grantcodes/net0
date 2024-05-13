import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

import sitemap from '@astrojs/sitemap'
import swsIntegration from './toolbar/integration.ts'

// https://astro.build/config
export default defineConfig({
  site: 'https://sws.grant.codes',
  output: 'static',
  integrations: [
    swsIntegration,
    starlight({
      defaultLocale: 'root',
      logo: {
        src: './public/favicon.svg',
      },
      locales: {
        root: {
          label: 'English',
          lang: 'en',
        },
      },
      title: {
        en: 'Docs',
      },
      customCss: [
        '@picocss/pico/css/pico.jade.min.css',
        './src/styles/docs.css',
      ],
    }),
    sitemap(),
  ],
})
