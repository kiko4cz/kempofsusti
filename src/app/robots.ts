import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/private/', // Example
        },
        sitemap: 'https://www.kempofsusti.cz/sitemap.xml',
    }
}
