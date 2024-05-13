import { defineToolbarApp } from 'astro/toolbar'
import co2 from '@tgwf/co2'

const motivationalMessages = [
  "You're doing great!",
  'Keep up the good work!',
  "You're awesome!",
  "You're a star!",
]

export default defineToolbarApp({
  init(canvas, app, server) {
    const container = document.createElement('div')
    container.style.position = 'fixed'
    container.style.inset = '1rem'
    container.style.background = '#222'
    container.style.padding = '1rem'

    console.log(co2)
    const h1 = document.createElement('h1')
    h1.textContent =
      motivationalMessages[
        Math.floor(Math.random() * motivationalMessages.length)
      ]

    container.append(h1)

    canvas.append(container)
  },
})
