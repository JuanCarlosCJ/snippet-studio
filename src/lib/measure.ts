import type { Measure } from './types'

let ctx: CanvasRenderingContext2D | null | undefined

/**
 * Measures text with a hidden canvas, the same way the browser would draw it.
 * Outside a browser (tests) it falls back to a rough estimate.
 */
export const measureText: Measure = (text, font) => {
  if (ctx === undefined) {
    ctx = typeof document === 'undefined' ? null : document.createElement('canvas').getContext('2d')
  }
  if (!ctx) return text.length * parseFloat(font) * 0.5
  ctx.font = font
  return ctx.measureText(text).width
}
