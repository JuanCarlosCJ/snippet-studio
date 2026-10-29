import { useI18n } from '../i18n'
import { checkKey } from '../i18n/texts'
import type { Check } from '../lib/checks'

const ICONS = { ok: '✓', warn: '!', error: '×' }

export function Checks({ checks }: { checks: Check[] }) {
  const { t } = useI18n()
  const errors = checks.filter(c => c.level === 'error').length
  const warnings = checks.filter(c => c.level === 'warn').length
  // Problems first, then the things that are fine.
  const order = { error: 0, warn: 1, ok: 2 }
  const sorted = [...checks].sort((a, b) => order[a.level] - order[b.level])

  return (
    <section className="panel checks" aria-labelledby="checks-heading">
      <div className="panelHead">
        <h2 id="checks-heading">{t('checks.heading')}</h2>
        <span className={`pill ${errors ? 'error' : warnings ? 'warn' : 'ok'}`}>
          {errors || warnings
            ? [errors && t('checks.errors', { n: errors }), warnings && t('checks.warnings', { n: warnings })]
                .filter(Boolean)
                .join(' · ')
            : t('checks.allGood')}
        </span>
      </div>
      <ul>
        {sorted.map(c => (
          <li key={c.id} className={c.level}>
            <span className="icon" aria-hidden>
              {ICONS[c.level]}
            </span>
            <span>{t(checkKey(c.id), c.values)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
