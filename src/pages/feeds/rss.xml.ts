import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { TITLE } from 'astro:env/server'

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
    title: `${TITLE} Blog`,
    description: 'A humble Astronaut’s guide to the stars',
    site: context.site,
    items: blog.map(getItem),
  })
}
