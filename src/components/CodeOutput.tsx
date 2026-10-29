import { useI18n } from '../i18n'
import { useCopy } from '../lib/hooks'

export function CodeOutput({ code }: { code: string }) {
  const { t } = useI18n()
  const [copied, copy] = useCopy()
  return (
    <section className="panel code" aria-labelledby="code-heading">
      <div className="panelHead">
        <div>
          <h2 id="code-heading">{t('code.heading')}</h2>
          <p className="muted small">{t('code.hint')}</p>
        </div>
        <button type="button" className={`btn${copied ? ' done' : ''}`} onClick={() => copy(code)}>
          {copied ? `✓ ${t('code.copied')}` : t('code.copy')}
        </button>
      </div>
      <pre tabIndex={0}>
        <code>{code}</code>
      </pre>
    </section>
  )
}
