import { useEffect, useMemo, useRef, useState } from 'react'
import { Checks } from './components/Checks'
import { CodeOutput } from './components/CodeOutput'
import { Editor } from './components/Editor'
import type { Upload } from './components/ImageField'
import { Previews } from './components/Previews'
import type { PreviewData } from './components/previews/shared'
import { useI18n } from './i18n'
import { demoSnippet, type Lang } from './i18n/texts'
import { isLargeImage, runChecks } from './lib/checks'
import { useCopy, useDebounced, useImageInfo } from './lib/hooks'
import { buildMetaTags } from './lib/metaTags'
import { decodeSnippet, encodeSnippet } from './lib/share'
import { normalize } from './lib/truncate'
import type { Snippet } from './lib/types'
import { parseUrl, resolveImageUrl } from './lib/url'

const ORIGIN = window.location.origin
const sameSnippet = (a: Snippet, b: Snippet) => JSON.stringify(a) === JSON.stringify(b)

export default function App() {
  const { lang, setLang, t } = useI18n()
  const [snippet, setSnippet] = useState<Snippet>(() => decodeSnippet(window.location.hash) ?? demoSnippet(lang, ORIGIN))
  const [upload, setUpload] = useState<Upload | null>(null)
  const edited = useRef(!!decodeSnippet(window.location.hash))
  const [shared, copyLink] = useCopy()

  // Keep the share link in the address bar, once the user has changed something.
  useEffect(() => {
    if (!edited.current) return
    const id = setTimeout(() => history.replaceState(null, '', encodeSnippet(snippet)), 300)
    return () => clearTimeout(id)
  }, [snippet])

  // Free the memory used by an uploaded file when it's replaced or removed.
  useEffect(() => () => {
    if (upload) URL.revokeObjectURL(upload.url)
  }, [upload])

  const change = (patch: Partial<Snippet>) => {
    edited.current = true
    setSnippet(s => ({ ...s, ...patch }))
  }

  const switchLang = (next: Lang) => {
    // While the demo is untouched, swap it for the demo in the new language.
    if (sameSnippet(snippet, demoSnippet(lang, ORIGIN))) setSnippet(demoSnippet(next, ORIGIN))
    setLang(next)
  }

  const reset = () => {
    edited.current = false
    setUpload(null)
    setSnippet(demoSnippet(lang, ORIGIN))
    history.replaceState(null, '', window.location.pathname)
  }

  const imageUrl = useDebounced(snippet.imageUrl, 400)
  const pageUrl = useDebounced(snippet.url, 400)
  const imageSrc = upload?.url ?? resolveImageUrl(imageUrl, pageUrl)
  const image = useImageInfo(imageSrc, upload?.bytes)

  const checks = useMemo(() => runChecks(snippet, image, { uploaded: !!upload }), [snippet, image, upload])
  const code = useMemo(
    () => buildMetaTags(snippet, { image, uploaded: !!upload, uploadPlaceholder: t('code.uploadPlaceholder') }),
    [snippet, image, upload, t],
  )

  const preview: PreviewData = useMemo(() => {
    const parsed = parseUrl(snippet.url)
    return {
      title: normalize(snippet.title),
      description: normalize(snippet.description),
      siteName: normalize(snippet.siteName),
      parsed,
      domain: parsed.ok ? parsed.domain : snippet.url.trim(),
      href: snippet.url.trim(),
      imageSrc,
      image,
      large: isLargeImage(image),
    }
  }, [snippet, imageSrc, image])

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <Logo />
          <div>
            <h1>Snippet Studio</h1>
            <p>{t('app.tagline')}</p>
          </div>
        </div>
        <div className="topActions">
          <button type="button" className="btn ghost" onClick={reset}>
            {t('app.reset')}
          </button>
          <button
            type="button"
            className={`btn primary${shared ? ' done' : ''}`}
            onClick={() => copyLink(ORIGIN + window.location.pathname + encodeSnippet(snippet))}
          >
            {shared ? `✓ ${t('app.shared')}` : t('app.share')}
          </button>
          <div className="langSwitch" role="group" aria-label="Language">
            {(['en', 'es'] as const).map(l => (
              <button key={l} type="button" aria-pressed={lang === l} onClick={() => switchLang(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="layout">
        <div className="side">
          <Editor
            snippet={snippet}
            onChange={change}
            image={image}
            upload={upload}
            onUpload={file => setUpload({ url: URL.createObjectURL(file), name: file.name, bytes: file.size })}
            onClearUpload={() => setUpload(null)}
            onUseExample={() => {
              setUpload(null)
              change({ imageUrl: `${ORIGIN}/example.jpg` })
            }}
          />
          <Checks checks={checks} />
        </div>
        <div className="main">
          <Previews data={preview} />
          <CodeOutput code={code} />
        </div>
      </main>

      <footer className="footer">
        <p>{t('app.privacy')}</p>
        <p>
          {t('app.madeBy')} <a href="https://juancarloscj.com">Juan Carlos</a>
        </p>
      </footer>
    </div>
  )
}

function Logo() {
  return (
    <svg className="logo" viewBox="0 0 40 40" aria-hidden>
      <rect x="2" y="6" width="36" height="28" rx="7" fill="var(--accent)" />
      <rect x="7" y="11" width="12" height="10" rx="2.5" fill="#fff" opacity=".95" />
      <rect x="22" y="12" width="11" height="3" rx="1.5" fill="#fff" />
      <rect x="22" y="18" width="8" height="2.5" rx="1.25" fill="#fff" opacity=".7" />
      <rect x="7" y="25" width="26" height="3" rx="1.5" fill="#fff" opacity=".7" />
    </svg>
  )
}
