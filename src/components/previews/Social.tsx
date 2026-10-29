import { useI18n } from '../../i18n'
import { Avatar, PreviewImage, type PreviewData } from './shared'

const authorName = (data: PreviewData, fallback: string) => data.siteName || fallback

export function WhatsApp({ data }: { data: PreviewData }) {
  const { t } = useI18n()
  const hasImage = data.image.status === 'ok' && !!data.imageSrc
  return (
    <div className="wa">
      <div className="wa-bubble">
        <div className={`wa-card${data.large ? ' large' : ''}`}>
          {hasImage && data.large && <PreviewImage data={data} className="wa-img" />}
          <div className="wa-row">
            {hasImage && !data.large && <PreviewImage data={data} className="wa-thumb" />}
            <div className="wa-text">
              <strong className="clamp2">{data.title || t('preview.noTitle')}</strong>
              {data.description && <span className="wa-desc clamp2">{data.description}</span>}
              <span className="wa-domain">{data.domain}</span>
            </div>
          </div>
        </div>
        <div className="wa-msg">
          <span className="wa-link">{data.href}</span>
          <span className="wa-meta">
            12:34 <span className="wa-ticks">✓✓</span>
          </span>
        </div>
      </div>
    </div>
  )
}

function PostHeader({ name, sub }: { name: string; sub: string }) {
  return (
    <div className="post-head">
      <Avatar name={name} size={40} />
      <div>
        <strong>{name}</strong>
        <span>{sub}</span>
      </div>
    </div>
  )
}

export function LinkedIn({ data }: { data: PreviewData }) {
  const { t } = useI18n()
  const name = authorName(data, t('preview.yourName'))
  return (
    <div className="li post">
      <PostHeader name={name} sub={`${t('preview.time')} · 🌐`} />
      <p className="post-text">{t('preview.postText')}</p>
      <div className={`li-card${data.large ? '' : ' small'}`}>
        {data.image.status === 'ok' && data.imageSrc ? (
          <PreviewImage data={data} className="li-img" />
        ) : (
          <div className="li-img placeholder" />
        )}
        <div className="li-text">
          <strong className="clamp2">{data.title || t('preview.noTitle')}</strong>
          <span>{data.domain}</span>
        </div>
      </div>
    </div>
  )
}

export function XPost({ data }: { data: PreviewData }) {
  const { t } = useI18n()
  const name = authorName(data, t('preview.yourName'))
  const hasImage = data.image.status === 'ok' && !!data.imageSrc
  return (
    <div className="x post">
      <div className="x-layout">
        <Avatar name={name} size={40} />
        <div className="x-body">
          <div className="x-head">
            <strong>{name}</strong>
            <span>@{name.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'you'} · {t('preview.time')}</span>
          </div>
          <p className="post-text">{t('preview.postText')}</p>
          {hasImage && data.large ? (
            <>
              <div className="x-card large">
                <PreviewImage data={data} className="x-img" />
                <span className="x-overlay">{data.title || data.domain}</span>
              </div>
              <span className="x-from">{t('preview.from', { domain: data.domain })}</span>
            </>
          ) : (
            <div className="x-card summary">
              {hasImage ? <PreviewImage data={data} className="x-thumb" /> : <div className="x-thumb placeholder">🔗</div>}
              <div className="x-text">
                <span>{data.domain}</span>
                <strong className="clamp1">{data.title || t('preview.noTitle')}</strong>
                {data.description && <span className="clamp2">{data.description}</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function Facebook({ data }: { data: PreviewData }) {
  const { t } = useI18n()
  const name = authorName(data, t('preview.yourName'))
  const hasImage = data.image.status === 'ok' && !!data.imageSrc
  return (
    <div className="fb post">
      <PostHeader name={name} sub={`${t('preview.time')} · 🌐`} />
      <p className="post-text">{t('preview.postText')}</p>
      <div className={`fb-card${hasImage && !data.large ? ' small' : ''}`}>
        {hasImage && <PreviewImage data={data} className="fb-img" />}
        <div className="fb-text">
          <span className="fb-domain">{data.domain.toUpperCase()}</span>
          <strong className="clamp2">{data.title || t('preview.noTitle')}</strong>
          {data.description && <span className="clamp1">{data.description}</span>}
        </div>
      </div>
    </div>
  )
}
