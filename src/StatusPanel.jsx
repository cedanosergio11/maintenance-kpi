import { fmtNum } from './helpers.js'

export default function StatusPanel({ panel, titleExtra, ui, i18n }) {
  if (!panel) return null
  const { counts, offList, absentList } = panel
  const total =
    counts.on + counts.off + counts.insufficient + (counts.absent || 0) || 1
  const statusLabel = (k) => {
    if (k === 'on') return i18n.status_on
    if (k === 'off') return i18n.status_off
    if (k === 'absent') return i18n.status_absent || ui.no_baseline
    return i18n.status_insufficient
  }
  return (
    <div className="card">
      <h2>
        {ui.template_status}
        {titleExtra}
      </h2>
      <p className="caption">{i18n.quality_kpi}</p>
      <div className="status-pills">
        <span className="pill on">
          {statusLabel('on')} <span className="n">{counts.on}</span>
        </span>
        <span className="pill off">
          {statusLabel('off')} <span className="n">{counts.off}</span>
        </span>
        <span className="pill insuff">
          {statusLabel('insufficient')} <span className="n">{counts.insufficient}</span>
        </span>
        {(counts.absent || 0) > 0 && (
          <span className="pill insuff">
            {statusLabel('absent')} <span className="n">{counts.absent}</span>
          </span>
        )}
      </div>
      <div className="status-bar" aria-hidden>
        <span className="on" style={{ width: `${(counts.on / total) * 100}%` }} />
        <span className="off" style={{ width: `${(counts.off / total) * 100}%` }} />
        <span
          className="insuff"
          style={{ width: `${(counts.insufficient / total) * 100}%` }}
        />
      </div>
      <div className="caption strong" style={{ marginBottom: '0.4rem' }}>
        {ui.off_templates}
      </div>
      {offList.length === 0 ? (
        <p className="caption">{ui.none_off}</p>
      ) : (
        <ul className="off-list">
          {offList.map((t) => (
            <li key={t.id}>
              <span className="name" title={t.label}>
                {t.label}
              </span>
              <span className="meta">
                {fmtNum(t.avg_days, 1)} → {fmtNum(t.target, 1)} · n={t.closed}
              </span>
            </li>
          ))}
        </ul>
      )}
      {absentList?.length > 0 && (
        <>
          <div className="caption strong" style={{ margin: '0.7rem 0 0.35rem' }}>
            {ui.absent}
          </div>
          <ul className="off-list">
            {absentList.map((t) => (
              <li key={t.id}>
                <span className="name">{t.label}</span>
                <span className="meta">{ui.no_baseline} · 0</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
