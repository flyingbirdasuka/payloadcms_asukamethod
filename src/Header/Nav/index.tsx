'use client'

import React, { useState, useEffect } from 'react'
import { MenuIcon, XIcon } from 'lucide-react'
import type { Header as HeaderType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import Link from 'next/link'
// import { SearchIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const isJapanese = pathname.startsWith('/ja')
  const localePrefix = isJapanese ? '/ja' : ''
  const switcherHref = isJapanese ? pathname.replace(/^\/ja/, '') || '/' : `/ja${pathname}`
  const switcherLabel = isJapanese ? 'EN' : '日本語'

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <>
      {/* Hamburger toggle button visible only on small screens */}
      <button
        className={`sm:hidden p-2 rounded-md transition ${
          open ? 'bg-transparent' : 'hover:bg-gray-200'
        }`}
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation menu"
      >
        {open ? (
          <XIcon className="w-6 h-6 text-asukamethod" />
        ) : (
          <MenuIcon className="w-6 h-6 text-asukamethod" />
        )}
      </button>

      {/* Nav items - hidden on mobile unless open */}
      <nav
        className={`gap-3 items-center ${
          open ? 'flex flex-col space-y-4 mt-4' : 'hidden sm:flex sm:flex-row'
        }`}
      >
        {navItems.map(({ link }, i) => (
          <div
            key={i}
            onClick={() => setOpen(false)}
            className="cursor-pointer w-full"
          >
            <CMSLink
              {...link}
              appearance="link"
              localePrefix={localePrefix}
              className="text-asukamethod hover:text-asukamethod-hover block px-3 py-1 rounded"
            />
          </div>
        ))}
        <Link
          href={switcherHref}
          className="shrink-0 text-asukamethod hover:text-asukamethod-hover px-3 py-1 rounded border border-current text-sm font-medium"
          onClick={() => setOpen(false)}
        >
          {switcherLabel}
        </Link>
      </nav>
    </>
  )
}
