import { PayloadRequest, CollectionSlug } from 'payload'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  posts: '/posts',
  pages: '',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug: string
  locale?: string
  req: PayloadRequest
}

export const generatePreviewPath = ({ collection, slug, locale = 'en' }: Props) => {
  const localePrefix = locale === 'en' ? '' : `/${locale}`
  const encodedParams = new URLSearchParams({
    slug,
    collection,
    path: `${localePrefix}${collectionPrefixMap[collection]}/${slug}`,
    previewSecret: process.env.PREVIEW_SECRET || '',
    locale,
  })

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
