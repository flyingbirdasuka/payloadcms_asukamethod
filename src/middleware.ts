import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const NON_DEFAULT_LOCALES = ['ja'] // add 'fr', 'de', etc. here when needed

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip Payload admin, API, Next.js internals, and static files
  if (
    pathname.startsWith('/asukamethod-admin') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/next/') ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  ) {
    return NextResponse.next()
  }

  // Redirect /en/... → /... to keep English URLs clean
  if (pathname.startsWith('/en/') || pathname === '/en') {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace(/^\/en/, '') || '/'
    return NextResponse.redirect(url)
  }

  // Non-default locale already in URL — let it through with locale request header
  const detectedLocale = NON_DEFAULT_LOCALES.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )
  if (detectedLocale) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-locale', detectedLocale)
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  // Rewrite to /en/... internally so [lang] routes handle it (URL stays the same)
  const url = request.nextUrl.clone()
  url.pathname = `/en${pathname}`
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-locale', 'en')
  return NextResponse.rewrite(url, { request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon).*)'],
}
