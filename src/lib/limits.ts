// Rough limits used by the platforms. None of them publish exact numbers,
// so these are the widely used community measurements.

export const FONTS = {
  googleTitle: '20px Arial, Helvetica, sans-serif',
  googleDescription: '14px Arial, Helvetica, sans-serif',
}

export const TITLE = {
  minChars: 30,
  maxChars: 60,
  /** Google desktop cuts titles at about this width. */
  maxPx: 580,
}

export const DESCRIPTION = {
  minChars: 70,
  maxChars: 160,
  /** Google desktop shows about two lines of description. */
  maxPx: 920,
}

export const IMAGE = {
  idealWidth: 1200,
  idealHeight: 630,
  /** Below this, most platforms switch to a small thumbnail. */
  largeMinWidth: 600,
  largeMinHeight: 315,
  /** Below this, Facebook and others ignore the image. */
  minSide: 200,
  ratio: 1.91,
  /** How far from 1.91:1 before we warn about cropping (10%). */
  ratioTolerance: 0.1,
  /** X rejects images bigger than this. */
  maxBytes: 5 * 1024 * 1024,
}
