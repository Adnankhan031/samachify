import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { legalDocs } from '@/data/legal'
import LegalView from '@/views/LegalView'

export function generateStaticParams() {
  return Object.keys(legalDocs).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const doc = legalDocs[slug]
  if (!doc) return { title: 'Not found' }
  return {
    title: doc.title,
    description: doc.intro.slice(0, 155),
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const doc = legalDocs[slug]
  if (!doc) notFound()
  return <LegalView doc={doc} />
}
