import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import * as m from '@i18n/messages.js'

export async function GET(context) {
  const blog = await getCollection('blog')

  const getItem = (post) => {
    // TODO: Add full content
    // TODO: i18n support
    return {
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      // This example assumes all posts are rendered as `/blog/[slug]` routes
      link: `/blog/${post.slug}/`,
    }
  }

  return rss({
    title: `${m.meta_title()} Blog`,
    description: m.meta_description(),
    site: context.site,
    items: blog.map(getItem),
  })
}
