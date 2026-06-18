import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { headers } from 'next/headers'
import React from 'react'

import type { Header } from '@/payload-types'

export async function Header({ children }: { children?: React.ReactNode }) {
  const headersList = await headers()
  const locale = headersList.get('x-locale') || 'en'
  const headerData: Header = await getCachedGlobal('header', 1, locale)()

  return (
    <>
      <HeaderClient data={headerData} />
      {children}
    </>
  )
}