import { useI18n } from '../i18n'
import { GoogleDesktop, GoogleMobile } from './previews/Google'
import { PreviewCard, type PreviewData } from './previews/shared'
import { Facebook, LinkedIn, WhatsApp, XPost } from './previews/Social'

export function Previews({ data }: { data: PreviewData }) {
  const { t } = useI18n()
  return (
    <section className="previews" aria-labelledby="previews-heading">
      <div className="sectionHead">
        <h2 id="previews-heading">{t('previews.heading')}</h2>
        <p className="muted small">{t('previews.note')}</p>
      </div>
      <div className="previewGrid">
        <PreviewCard label={t('preview.googleDesktop')} wide>
          <GoogleDesktop data={data} />
        </PreviewCard>
        <PreviewCard label={t('preview.googleMobile')}>
          <GoogleMobile data={data} />
        </PreviewCard>
        <PreviewCard label={t('preview.whatsapp')}>
          <WhatsApp data={data} />
        </PreviewCard>
        <PreviewCard label={t('preview.linkedin')}>
          <LinkedIn data={data} />
        </PreviewCard>
        <PreviewCard label={t('preview.x')}>
          <XPost data={data} />
        </PreviewCard>
        <PreviewCard label={t('preview.facebook')} wide>
          <Facebook data={data} />
        </PreviewCard>
      </div>
    </section>
  )
}
