import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type Global = keyof Config['globals']

async function getGlobal(slug: Global, depth = 0, locale = 'en') {
  const payload = await getPayload({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth,
    locale: locale as 'en' | 'ja',
  })

  return global
}

export const getCachedGlobal = (slug: Global, depth = 0, locale = 'en') =>
  unstable_cache(async () => getGlobal(slug, depth, locale), [slug, locale], {
    tags: [`global_${slug}_${locale}`],
  })
