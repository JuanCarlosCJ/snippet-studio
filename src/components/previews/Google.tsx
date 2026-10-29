import { DESCRIPTION, FONTS, TITLE } from '../../lib/limits'
import { truncateToWidth } from '../../lib/truncate'
import { breadcrumb } from '../../lib/url'
import { useI18n } from '../../i18n'
import { Avatar, type PreviewData } from './shared'

function SiteLine({ data }: { data: PreviewData }) {
  const name = data.siteName || data.domain || 'example.com'
  return (
    <div className="g-site">
      <span className="g-favicon">
        <Avatar name={name} size={18} />
      </span>
      <div className="g-siteText">
        <span className="g-siteName">{name}</span>
        <span className="g-url">{breadcrumb(data.parsed) || data.href}</span>
      </div>
      <span className="g-dots" aria-hidden>⋮</span>
    </div>
  )
}

export function GoogleDesktop({ data }: { data: PreviewData }) {
  const { t } = useI18n()
  // Google cuts by pixel width, so measure with the same font it uses.
  const title = truncateToWidth(data.title || t('preview.noTitle'), TITLE.maxPx, FONTS.googleTitle).text
  const desc = truncateToWidth(data.description, DESCRIPTION.maxPx, FONTS.googleDescription).text
  return (
    <div className="g g-desktop">
      <SiteLine data={data} />
      <h3 className="g-title">{title}</h3>
      {desc && <p className="g-desc">{desc}</p>}
    </div>
  )
}

export function GoogleMobile({ data }: { data: PreviewData }) {
  const { t } = useI18n()
  return (
    <div className="phone">
      <div className="g g-mobile">
        <SiteLine data={data} />
        <h3 className="g-title">{data.title || t('preview.noTitle')}</h3>
        {data.description && <p className="g-desc">{data.description}</p>}
      </div>
    </div>
  )
}
