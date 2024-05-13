import { fileURLToPath } from 'node:url'
import type { AstroIntegration } from 'astro'

export default {
  name: 'sustainable-web-starater',
  hooks: {
    'astro:config:setup': ({ addDevToolbarApp }) => {
      addDevToolbarApp({
        id: 'sustainable-web-starter',
        name: 'SWS',
        icon: '🌱',
        entrypoint: fileURLToPath(new URL('./app.ts', import.meta.url)),
      })
    },
  },
} satisfies AstroIntegration
