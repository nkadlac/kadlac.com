import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const articles = await getCollection('articles');

  // Sort by date, newest first
  const sortedArticles = articles.sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );

  return rss({
    title: 'Nate Kadlac',
    description: 'Essays on design, branding, creativity, and visual communication for non-designers and solopreneurs.',
    site: context.site!,
    items: sortedArticles.map((article) => ({
      title: article.data.title,
      pubDate: article.data.date,
      description: article.data.description || '',
      link: `/articles/${article.slug}/`,
      ...(article.data.image && {
        customData: `<media:content url="${context.site}${article.data.image.startsWith('/') ? article.data.image.slice(1) : article.data.image}" medium="image" />`
      }),
    })),
    customData: `<language>en-us</language>`,
    xmlns: {
      media: 'http://search.yahoo.com/mrss/',
    },
  });
}
