import { MetadataRoute } from 'next'

/**
 * Sitemap dynamique pour JARVIS Site Vitrine
 * Généré automatiquement par Next.js
 * https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://jarvis-group.net'
  
  // Pages statiques principales
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/landing-client`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ]

  return staticPages
}


