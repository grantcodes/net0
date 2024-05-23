---
title: Delete what you don't need
description: How to remove features from Net0.1 which you don't need.
---

An important part of making sustainable products is avoiding making things you don't need, and that's no different for websites. With that in mind Net0.1 is set up for you to be able to remove parts which you don't need, and keep what is most important to you.

## Removing docs

To remove the docs functionality there are a few steps:

1. Remove the docs content folder at `src/content/docs`
2. Remove the docs config in `astro.config.mjs`, removing the entire `starlight` integration
3. Uninstall the dependencies with `npm uninstall @astrojs/starlight`

## Removing the blog

1. Remove the blog content folder at `src/content/blog`
2. Remove the blog page folders at `src/pages/blog`, `src/pages/[lang]/blog` and `src/pages/es/blog`
3. Remove the RSS feed by removing the `src/pages/feeds` folder and uninstalling the dependency `npm uninstall @astrojs/rss`
   - NOTE: Feel free to keep and modify the RSS setup if it's useful for you for other content
