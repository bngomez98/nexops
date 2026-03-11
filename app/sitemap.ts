import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://nexusoperations.org', lastModified: new Date(), changeFrequency: 'yearly', priority: 1 },
    { url: 'https://nexusoperations.org/faq', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://nexusoperations.org/auth/sign-up', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.9 },
    { url: 'https://nexusoperations.org/auth/login', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.8 },
  ]
}
