import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

import sitemap from '@astrojs/sitemap'
import net0Integration from './toolbar/integration.ts'

// https://astro.build/config
export default defineConfig({
  site: 'https://net0.grant.codes',
  output: 'static',
  i18n: {
    defaultLocale: 'en',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    net0Integration,
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
        en: 'Net0.1',
      },
      customCss: [
        '@picocss/pico/css/pico.conditional.jade.min.css',
        './src/styles/docs.css',
      ],
    }),
    sitemap(),
  ],
})
