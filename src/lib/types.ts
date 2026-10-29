/** Everything the user types in. This is also what goes into a share link. */
export interface Snippet {
  url: string
  title: string
  description: string
  siteName: string
  imageUrl: string
  twitterSite: string
}

export type ImageStatus = 'none' | 'loading' | 'ok' | 'error'

export interface ImageInfo {
  status: ImageStatus
  width?: number
  height?: number
  /** Only known for uploaded files. */
  bytes?: number
}

/** Measures how wide a string is in pixels for a CSS font. */
export type Measure = (text: string, font: string) => number
