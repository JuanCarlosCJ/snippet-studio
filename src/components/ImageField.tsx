import { useId, useRef, useState, type DragEvent } from 'react'
import { useI18n } from '../i18n'
import type { ImageInfo } from '../lib/types'

export interface Upload {
  url: string
  name: string
  bytes: number
}

interface Props {
  value: string
  onChange: (value: string) => void
  image: ImageInfo
  upload: Upload | null
  onUpload: (file: File) => void
  onClearUpload: () => void
  onUseExample: () => void
}

export function ImageField({ value, onChange, image, upload, onUpload, onClearUpload, onUseExample }: Props) {
  const { t } = useI18n()
  const id = useId()
  const fileRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const takeFile = (file?: File | null) => {
    if (file && file.type.startsWith('image/')) onUpload(file)
  }
  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    takeFile(e.dataTransfer.files?.[0])
  }

  let status = ''
  if (image.status === 'loading') status = t('image.loading')
  else if (image.status === 'ok') status = t('image.size', { w: image.width ?? 0, h: image.height ?? 0 })

  return (
    <div
      className={`field imageField${dragging ? ' dragging' : ''}`}
      onDragOver={e => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <label htmlFor={id}>{t('image.label')}</label>

      {upload ? (
        <div className="uploadChip">
          <span>{t('image.uploaded', { name: upload.name })}</span>
          <button type="button" className="link" onClick={onClearUpload}>
            {t('image.remove')}
          </button>
        </div>
      ) : (
        <input
          id={id}
          type="url"
          inputMode="url"
          spellCheck={false}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={t('image.placeholder')}
        />
      )}

      <div className="imageActions">
        <button type="button" className="btn small" onClick={() => fileRef.current?.click()}>
          {t('image.upload')}
        </button>
        <button type="button" className="btn small ghost" onClick={onUseExample}>
          {t('image.example')}
        </button>
        <span className="muted small imageStatus">{status}</span>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={e => {
          takeFile(e.target.files?.[0])
          e.target.value = ''
        }}
      />
      {dragging && <div className="dropHint">{t('image.drop')}</div>}
    </div>
  )
}
