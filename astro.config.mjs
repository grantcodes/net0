import { defineConfig, envField } from 'astro/config'
import starlight from '@astrojs/starlight'

import sitemap from '@astrojs/sitemap'
import net0Integration from './integrations/toolbar/integration.ts'
import net0OgImagesIntegration from './integrations/og-images/integration.ts'

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
    net0OgImagesIntegration,
    starlight({
      logo: {
        src: './public/favicon.svg',
      },
      title: {
        en: 'Net0.1',
      },
      customCss: [
        '@picocss/pico/css/pico.conditional.jade.min.css',
        './src/styles/style.css',
        './src/styles/docs.css',
      ],
      editLink: {
        baseUrl: 'https://github.com/grantcodes/net0/edit/main/',
      },
      sidebar: [
        // { label: 'Getting started', link: '/getting-started/' },
        {
          label: 'Getting started',
          autogenerate: { directory: 'docs/getting-started' },
        },
        { label: 'Extending', autogenerate: { directory: 'docs/extending' } },
        {
          label: 'Recommendations',
          autogenerate: { directory: 'docs/recommendations' },
        },
        { label: 'Tech choices', link: '/docs/tech-choices/' },
      ],
      social: {
        github: 'https://github.com/grantcodes/net0',
      },
    }),
    sitemap(),
  ],
  experimental: {
    env: {
      schema: {
        TITLE: envField.string({
          context: 'server',
          access: 'public',
          default: 'Net0.1',
        }),
        META_TITLE_TEMPLATE: envField.string({
          context: 'server',
          access: 'public',
          default: '%s | Net0.1',
        }),
      },
    },
  },
})
