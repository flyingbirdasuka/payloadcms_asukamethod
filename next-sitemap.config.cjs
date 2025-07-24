// const SITE_URL =
//   process.env.NEXT_PUBLIC_SERVER_URL ||
//   process.env.VERCEL_PROJECT_PRODUCTION_URL ||
//   'https://asukamethod.com'

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://asukamethod.com'

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: ['/posts-sitemap.xml', '/pages-sitemap.xml', '/*', '/posts/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: '/asukamethod-admin/*',
      },
    ],
    additionalSitemaps: [`${SITE_URL}/pages-sitemap.xml`, `${SITE_URL}/posts-sitemap.xml`],
  },
}
