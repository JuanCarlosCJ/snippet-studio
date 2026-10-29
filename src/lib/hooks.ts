import { useEffect, useState } from 'react'
import type { ImageInfo } from './types'

/** Returns the value once it has stopped changing for `ms` milliseconds. */
export function useDebounced<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), ms)
    return () => clearTimeout(id)
  }, [value, ms])
  return debounced
}

/** Loads an image to find out its real size (works for any URL, no CORS needed). */
export function useImageInfo(src: string | null, bytes?: number): ImageInfo {
  const [info, setInfo] = useState<ImageInfo>({ status: src ? 'loading' : 'none' })

  useEffect(() => {
    if (!src) {
      setInfo({ status: 'none' })
      return
    }
    let cancelled = false
    setInfo({ status: 'loading' })
    const img = new Image()
    img.onload = () => {
      if (!cancelled) setInfo({ status: 'ok', width: img.naturalWidth, height: img.naturalHeight, bytes })
    }
    img.onerror = () => {
      if (!cancelled) setInfo({ status: 'error' })
    }
    img.src = src
    return () => {
      cancelled = true
    }
  }, [src, bytes])

  return info
}

/** Copies text and reports success for a couple of seconds. */
export function useCopy(): [boolean, (text: string) => void] {
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 1800)
    return () => clearTimeout(id)
  }, [copied])

  const copy = (text: string) => {
    const done = () => setCopied(true)
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text) && done())
    } else if (fallbackCopy(text)) done()
  }
  return [copied, copy]
}

function fallbackCopy(text: string): boolean {
  const area = document.createElement('textarea')
  area.value = text
  area.style.position = 'fixed'
  area.style.opacity = '0'
  document.body.appendChild(area)
  area.select()
  let ok = false
  try {
    ok = document.execCommand('copy')
  } catch {
    ok = false
  }
  area.remove()
  return ok
}
