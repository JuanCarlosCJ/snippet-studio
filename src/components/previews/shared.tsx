import type { ReactNode } from 'react'
import type { ImageInfo } from '../../lib/types'
import type { ParsedUrl } from '../../lib/url'

/** Everything a preview needs, worked out once in App. */
export interface PreviewData {
  title: string
  description: string
  siteName: string
  parsed: ParsedUrl
  /** "example.com", or the raw text if the URL is invalid. */
  domain: string
  /** Full URL as typed (for message bubbles). */
  href: string
  imageSrc: string | null
  image: ImageInfo
  /** Big 1.91:1 card vs small thumbnail. */
  large: boolean
}

const COLORS = ['#e8710a', '#1a73e8', '#188038', '#a142f4', '#d93025', '#007b83']

/** A coloured circle with an initial, standing in for a favicon or profile photo. */
export function Avatar({ name, size = 28 }: { name: string; size?: number }) {
  const letter = Array.from(name.trim())[0]?.toUpperCase() ?? '?'
  let hash = 0
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) | 0
  const bg = COLORS[Math.abs(hash) % COLORS.length]
  return (
    <span className="avatar" style={{ width: size, height: size, background: bg, fontSize: size * 0.46 }} aria-hidden>
      {letter}
    </span>
  )
}

export function PreviewImage({ data, className }: { data: PreviewData; className?: string }) {
  if (!data.imageSrc || data.image.status !== 'ok') return null
  return <img className={className} src={data.imageSrc} alt="" draggable={false} />
}

export function PreviewCard({ label, children, wide }: { label: string; children: ReactNode; wide?: boolean }) {
  return (
    <figure className={`previewCard${wide ? ' wide' : ''}`}>
      <figcaption>{label}</figcaption>
      <div className="previewStage">{children}</div>
    </figure>
  )
}
