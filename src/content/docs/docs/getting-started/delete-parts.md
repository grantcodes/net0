---
title: Delete what you don't need
description: How to remove features from Net0.1 which you don't need.
---

An important part of making sustainable products is avoiding making things you don't need, and that's no different for websites. With that in mind Net0.1 is set up for you to be able to remove parts which you don't need, and keep what is most important to you.

## Removing docs

To remove the docs functionality there are a few steps:

1. Remove the docs content folder at `src/content/docs`
2. Remove the docs styles at `src/styles/docs.css`
3. Remove the docs config in `astro.config.mjs`, removing the entire `starlight` integration
4. Uninstall the dependencies with `npm uninstall @astrojs/starlight`

## Removing the blog

1. Remove the blog content folder at `src/content/blog`
2. Remove the blog page folders at `src/pages/blog`, `src/pages/[lang]/blog` and `src/pages/es/blog`
3. Remove the RSS feed by removing the `src/pages/feeds` folder and uninstalling the dependency `npm uninstall @astrojs/rss`
   - NOTE: Feel free to keep and modify the RSS setup if it's useful for you for other content

## Removing custom components & pages

Included in the starter kit are a few basic astro components & pages already set up, but it's likely you'll want to make your own. Feel free to remove them and start from scratch.

1. Remove all the content in `src/components`
2. Remove the custom pages at `src/pages/resources` & `src/pages/index.astro`

## Removing Pico.css

If you want to use other styles (be it a framework or writing your own) then it makes sense to remove Pico.css and the custom styles for Net0.

1. Uninstall pico.css with `npm uninstall @picocss/pico`
2. Remove the `import` statement in the main layout file at `src/layouts/Layout.astro`
3. Remove docs css which extends Pico.css:
   1. Remove the `src/style/docs.css` file
   2. Remove / replace the starlight `customCss` setting in the `astro.config.mjs` file

## Removing i18n

If your website / product is only going to be available in one language you will not need the translation & internationalization functionality that is included out of the box.

1. Remove non-default language content folders at `src/content/blog/es`
2. Remove non-default language page folders at `src/pages/[lang]` and `src/pages/es`
3. The i18n related functionality in `src/i18n` can also be removed, but doing so will break various components and pages which use the helper functions.
