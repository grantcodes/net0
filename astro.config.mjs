import { defineConfig, envField } from 'astro/config'
import starlight from '@astrojs/starlight'
import sitemap from '@astrojs/sitemap'
import { envDefaults } from './integrations/env-defaults.ts'
import net0OgImagesIntegration from './integrations/og-images/integration.ts'
import footprintAstro from '@grantcodes/footprint-astro'

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
    footprintAstro,
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
          default: envDefaults.TITLE,
        }),
        META_TITLE_TEMPLATE: envField.string({
          context: 'server',
          access: 'public',
          default: envDefaults.META_TITLE_TEMPLATE,
        }),
        META_DESCRIPTION: envField.string({
          context: 'server',
          access: 'public',
          default: envDefaults.META_DESCRIPTION,
        }),
        META_TWITTER: envField.string({
          context: 'server',
          access: 'public',
          default: envDefaults.META_TWITTER,
        }),
        OG_IMAGE_COLOR: envField.string({
          context: 'server',
          access: 'public',
          default: envDefaults.OG_IMAGE_COLOR,
        }),
        OG_IMAGE_BACKGROUND_COLOR: envField.string({
          context: 'server',
          access: 'public',
          default: envDefaults.TITLE,
        }),
        OG_IMAGE_FONT_NAME: envField.string({
          context: 'server',
          access: 'public',
          default: envDefaults.OG_IMAGE_BACKGROUND_COLOR,
        }),
        OG_IMAGE_FONT_FILE: envField.string({
          context: 'server',
          access: 'public',
          default: envDefaults.OG_IMAGE_FONT_FILE,
        }),
      },
    },
  },
})
