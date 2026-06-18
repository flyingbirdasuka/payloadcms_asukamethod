import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'Asuka Method - Online dance lessons.',
  images: [
    {
      url: `${getServerSideURL()}/og-image.jpg`,
    },
  ],
  siteName: 'Asuka Method',
  title: 'Asuka Method',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
