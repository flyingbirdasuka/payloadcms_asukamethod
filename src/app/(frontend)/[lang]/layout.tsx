import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { AdminBar } from '@/components/AdminBar'
import { Header } from '@/Header/Component'
import { Footer } from '@/Footer/Component'
import React from 'react'

const validLocales = ['en', 'ja'] // add 'fr', 'de', etc. here when needed

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!validLocales.includes(lang)) notFound()

  const { isEnabled } = await draftMode()

  return (
    <>
      <AdminBar adminBarProps={{ preview: isEnabled }} />
      <Header />
      {children}
      <Footer />
    </>
  )
}
