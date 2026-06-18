import { getCachedGlobal } from '@/utilities/getGlobals'
import { headers } from 'next/headers'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'

export async function Footer() {
  const headersList = await headers()
  const locale = headersList.get('x-locale') || 'en'
  const footerData: Footer = await getCachedGlobal('footer', 1, locale)()


  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto border-t border-border bg-black dark:bg-card text-white">
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <Link className="flex items-center" href="/">
          {typeof footerData.logo === 'object' && footerData.logo?.url ? (
            <img
              src={footerData.logo.url ?? undefined}
              alt={footerData.logo.alt || 'Logo'}
              className="h-20 w-auto"
            />
          ) : (
            <span className="text-xl font-bold">MySite</span>
          )}
        </Link>

        <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
          {/* <ThemeSelector /> */}
          <div className='flex flex-col mr-20'>
            <p>© Copyright 2026 Asuka Method</p>
            <p>Asuka Method is a registered trademark in Benelux</p>
          </div>
          <nav className="flex flex-col md:flex-row gap-4">
            {navItems.map(({ link }, i) => {
              return <CMSLink className="text-white" key={i} {...link} />
            })}
          </nav>
        </div>
      </div>
    </footer>
  )
}
