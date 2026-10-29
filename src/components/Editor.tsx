import { useId, type ChangeEvent, type ReactNode } from 'react'
import { useI18n } from '../i18n'
import type { TextKey } from '../i18n/texts'
import { DESCRIPTION, FONTS, TITLE } from '../lib/limits'
import { measureText } from '../lib/measure'
import { normalize } from '../lib/truncate'
import type { ImageInfo, Snippet } from '../lib/types'
import { ImageField, type Upload } from './ImageField'

interface Props {
  snippet: Snippet
  onChange: (patch: Partial<Snippet>) => void
  image: ImageInfo
  upload: Upload | null
  onUpload: (file: File) => void
  onClearUpload: () => void
  onUseExample: () => void
}

export function Editor(props: Props) {
  const { snippet, onChange } = props
  const { t } = useI18n()
  const set = (key: keyof Snippet) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onChange({ [key]: e.target.value })

  return (
    <section className="panel editor" aria-labelledby="editor-heading">
      <h2 id="editor-heading">{t('editor.heading')}</h2>

      <Field label="field.url">
        {id => (
          <input id={id} type="url" inputMode="url" spellCheck={false} value={snippet.url} onChange={set('url')} placeholder="https://" />
        )}
      </Field>

      <Field label="field.title" hint="field.titleHint" counter={{ text: snippet.title, font: FONTS.googleTitle, ...TITLE }}>
        {id => <input id={id} type="text" value={snippet.title} onChange={set('title')} />}
      </Field>

      <Field
        label="field.description"
        hint="field.descriptionHint"
        counter={{ text: snippet.description, font: FONTS.googleDescription, ...DESCRIPTION }}
      >
        {id => <textarea id={id} rows={4} value={snippet.description} onChange={set('description')} />}
      </Field>

      <ImageField
        value={snippet.imageUrl}
        onChange={imageUrl => onChange({ imageUrl })}
        image={props.image}
        upload={props.upload}
        onUpload={props.onUpload}
        onClearUpload={props.onClearUpload}
        onUseExample={props.onUseExample}
      />

      <div className="row2">
        <Field label="field.siteName" optional>
          {id => <input id={id} type="text" value={snippet.siteName} onChange={set('siteName')} />}
        </Field>
        <Field label="field.twitterSite" optional>
          {id => (
            <input id={id} type="text" spellCheck={false} value={snippet.twitterSite} onChange={set('twitterSite')} placeholder="@" />
          )}
        </Field>
      </div>
    </section>
  )
}

interface CounterSpec {
  text: string
  font: string
  minChars: number
  maxChars: number
  maxPx: number
}

function Field({
  label,
  hint,
  optional,
  counter,
  children,
}: {
  label: TextKey
  hint?: TextKey
  optional?: boolean
  counter?: CounterSpec
  children: (id: string) => ReactNode
}) {
  const { t } = useI18n()
  const id = useId()
  return (
    <div className="field">
      <label htmlFor={id}>
        {t(label)}
        {optional && <span className="optional"> · {t('field.optional')}</span>}
      </label>
      {children(id)}
      {counter && <Counter {...counter} />}
      {hint && <p className="hint">{t(hint)}</p>}
    </div>
  )
}

function Counter({ text, font, minChars, maxChars, maxPx }: CounterSpec) {
  const { t } = useI18n()
  const clean = normalize(text)
  const chars = Array.from(clean).length
  const px = Math.round(measureText(clean, font))
  const level = px > maxPx || chars > maxChars ? 'warn' : chars < minChars ? 'short' : 'ok'
  const pct = Math.min(100, (px / maxPx) * 100)
  return (
    <div className={`counter ${level}`} aria-live="polite">
      <div className="bar">
        <span style={{ width: `${pct}%` }} />
      </div>
      <span>{t('counter.chars', { n: chars, max: maxChars })}</span>
      <span>{t('counter.px', { n: px, max: maxPx })}</span>
    </div>
  )
}
