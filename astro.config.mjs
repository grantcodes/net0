import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import sitemap from '@astrojs/sitemap'
import net0Integration from './toolbar/integration.ts'
import paraglide from '@inlang/paraglide-astro'
import * as m from './src/i18n/messages.js'
import net0Integration from './integrations/toolbar/integration.ts'
import net0OgImagesIntegration from './integrations/og-images/integration.ts'

const GITHUB = m.social_github()

const starlightEditLink = GITHUB ? { baseUrl: `${GITHUB}/edit/main/` } : {}
const starlightSocial = {}
if (GITHUB) {
  starlightSocial.github = GITHUB
}

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
    paraglide({
      project: './project.inlang',
      outdir: './src/i18n',
    }),
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
        en: m.meta_title(),
      },
      customCss: [
        '@picocss/pico/css/pico.conditional.jade.min.css',
        './src/styles/docs.css',
      ],
      editLink: starlightEditLink,
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
      social: starlightSocial,
    }),
    sitemap(),
  ],
})
