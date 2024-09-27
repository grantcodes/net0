import { fileURLToPath } from 'node:url'
import type { AstroIntegration } from 'astro'

export default {
  name: 'net0-toolbar',
  hooks: {
    'astro:config:setup': ({ addDevToolbarApp }) => {
      addDevToolbarApp({
        id: 'net0-toolbar',
        name: 'Net0',
        icon: '🌱',
        entrypoint: fileURLToPath(new URL('./app.ts', import.meta.url)),
      })
    },
  },
} satisfies AstroIntegration
