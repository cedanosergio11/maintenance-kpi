import { useEffect, useMemo, useState } from 'react'
import { UI } from './copy.js'
import { COLORS } from './theme.js'
import {
  fmtNum,
  fmtPct,
  sortedYears,
  labelMap,
  buildTemplatePanel,
  wipRows,
} from './helpers.js'
import StatusPanel from './StatusPanel.jsx'
import {
  DaysRepairChart,
  WipChart,
  EquipmentDonut,
  QuarterChart,
  HBar,
  CompareChart,
} from './Charts.jsx'
import Numbers from './Numbers.jsx'

export default function App() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [lang, setLang] = useState('en')
  const [equipYear, setEquipYear] = useState('2025')

  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}kpi-dashboard-data.json`
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(setData)
      .catch((e) => setError(e.message || String(e)))
  }, [])

  const ui = UI[lang] || UI.en
  const i18n = data?.i18n?.[lang] || data?.i18n?.en || {}
  const templates = useMemo(() => labelMap(data?.templates), [data])
  const equipment = useMemo(() => labelMap(data?.equipment_types), [data])
  const yearKeys = useMemo(() => sortedYears(data?.years || {}), [data])
  const y2024 = data?.years?.['2024']
  const y2025 = data?.years?.['2025']
  const y2026 = data?.years?.['2026']
  const minN = data?.meta?.min_repairs_to_score || 20
  const qualityDays2024 = y2024?.quality_days ?? null

  const daysByYear = useMemo(() => {
    if (!data) return []
    return yearKeys
      .map((y) => {
        const yr = data.years[y]
        if (!yr || yr.avg_days == null) return null
        return { year: y, avg_days: yr.avg_days, closed: yr.closed }
      })
      .filter(Boolean)
  }, [data, yearKeys])

  const wipByYear = useMemo(
    () => (data ? wipRows(data.years, yearKeys, COLORS) : []),
    [data, yearKeys]
  )

  const panel2025 = useMemo(
    () => (data ? buildTemplatePanel(y2025, y2024, templates, minN) : null),
    [data, y2025, y2024, templates, minN]
  )
  const panel2026 = useMemo(
    () => (data ? buildTemplatePanel(y2026, y2024, templates, minN) : null),
    [data, y2026, y2024, templates, minN]
  )

  const equipDonut = useMemo(() => {
    const yr = data?.years?.[equipYear]
    if (!yr?.by_equipment_type) return []
    return Object.entries(yr.by_equipment_type)
      .map(([id, row]) => {
        if (!row || (row.closed == null && row.share == null)) return null
        return {
          id,
          name: equipment[id] || id,
          value: row.closed ?? Math.round((row.share || 0) * 1000),
          share: row.share,
          avg_days: row.avg_days,
        }
      })
      .filter(Boolean)
      .sort((a, b) => b.value - a.value)
  }, [data, equipYear, equipment])

  const quarterData = useMemo(() => {
    if (!y2025?.by_quarter) return []
    return ['1', '2', '3', '4']
      .map((q) => {
        const row = y2025.by_quarter[q]
        if (!row || row.avg_days == null) return null
        return { quarter: `${ui.q}${q}`, avg_days: row.avg_days, closed: row.closed }
      })
      .filter(Boolean)
  }, [y2025, ui.q])

  const branchData = useMemo(() => {
    if (!y2025?.by_branch) return []
    return Object.entries(y2025.by_branch)
      .map(([name, row]) => {
        if (!row || row.avg_days == null) return null
        return { name, avg_days: row.avg_days, closed: row.closed }
      })
      .filter(Boolean)
      .sort((a, b) => b.avg_days - a.avg_days)
  }, [y2025])

  const deptData = useMemo(() => {
    if (!y2025?.by_department) return []
    return Object.entries(y2025.by_department)
      .map(([name, row]) => {
        if (!row || row.avg_days == null) return null
        return { name, avg_days: row.avg_days, closed: row.closed }
      })
      .filter(Boolean)
      .sort((a, b) => b.avg_days - a.avg_days)
  }, [y2025])

  const slips = useMemo(() => {
    const list = data?.insights?.biggest_slips_2025
    if (!Array.isArray(list)) return []
    return list
      .filter((r) => r && r.d24 != null && r.d25 != null)
      .map((r) => ({
        name: r.label || templates[r.id] || r.id,
        d24: r.d24,
        d25: r.d25,
        delta: r.delta,
      }))
  }, [data, templates])

  const improves = useMemo(() => {
    const list = data?.insights?.biggest_improves_2025
    if (!Array.isArray(list)) return []
    return list
      .filter((r) => r && r.d24 != null && r.d25 != null)
      .map((r) => ({
        name: r.label || templates[r.id] || r.id,
        d24: r.d24,
        d25: r.d25,
        delta: r.delta,
      }))
  }, [data, templates])

  if (error) {
    return (
      <div className="app">
        <div className="error">
          {ui.load_error} ({error})
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="app">
        <div className="loading">{ui.loading}</div>
      </div>
    )
  }

  const focus = y2026 || data.years[yearKeys[yearKeys.length - 1]]
  const asOf = data.meta?.as_of || '—'
  const y2025Status =
    y2025 && qualityDays2024 != null && y2025.closed >= minN
      ? y2025.avg_days <= qualityDays2024
        ? i18n.status_on
        : i18n.status_off
      : i18n.status_insufficient

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <h1>Maintenance KPI</h1>
            <span className="sub">{data.meta?.title || 'Stasis'}</span>
          </div>
          <div className="lang-toggle" role="group" aria-label="Language">
            <button
              type="button"
              className={lang === 'en' ? 'active' : ''}
              onClick={() => setLang('en')}
            >
              EN
            </button>
            <button
              type="button"
              className={lang === 'es' ? 'active' : ''}
              onClick={() => setLang('es')}
            >
              ES
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        <section className="section" aria-labelledby="sec-defs">
          <h2 className="section-title" id="sec-defs">
            {ui.sec_defs}
          </h2>
          <div className="callout">
            <ul>
              <li>{ui.def_closed}</li>
              <li>{ui.def_cycle}</li>
              <li>{ui.def_year}</li>
              <li>{ui.def_units}</li>
            </ul>
          </div>
        </section>

        <section className="section" aria-labelledby="sec-company">
          <h2 className="section-title" id="sec-company">
            {ui.sec_company}
          </h2>
          <div className="kpi-row kpi-3">
            <div className="kpi-card">
              <div className="label">
                {ui.closed}
                <span className="badge">{i18n.status_in_progress}</span>
              </div>
              <div className="value">{fmtNum(focus?.closed)}</div>
              <div className="hint">{ui.year_default}</div>
            </div>
            <div className="kpi-card">
              <div className="label">{ui.avg_days}</div>
              <div className="value">{fmtNum(focus?.avg_days, 1)}</div>
              <div className="hint">{ui.year_default}</div>
            </div>
            <div className="kpi-card">
              <div className="label">{ui.wip}</div>
              <div className="value">{fmtNum(focus?.wip_ytd ?? focus?.wip, 1)}</div>
              <div className="hint">
                {focus === y2026
                  ? `${ui.wip_ytd} ${ui.wip_div_ytd} · ${ui.wip_ann} ${fmtNum(focus?.wip_annualized, 1)} ${ui.wip_div_ann}`
                  : i18n.wip_disclaimer}
              </div>
            </div>
          </div>
          <p className="caption" style={{ marginTop: '-0.15rem' }}>
            {ui.company_status}: 2024 {fmtNum(qualityDays2024, 2)} · 2025 {y2025Status}
            {' · '}2026 {i18n.status_in_progress}
            {(y2026?.open || 0) > 0 ? ` (${y2026.open} open)` : ''}
          </p>
          <div className="grid-2">
            <DaysRepairChart
              data={daysByYear}
              qualityDays2024={qualityDays2024}
              ui={ui}
              i18n={i18n}
            />
            <WipChart data={wipByYear} ui={ui} i18n={i18n} />
          </div>
        </section>

        <section className="section" aria-labelledby="sec-breaks">
          <h2 className="section-title" id="sec-breaks">
            {ui.sec_breaks}
          </h2>
          <div className="kpi-row kpi-3">
            <div className="kpi-card">
              <div className="label">{ui.repeat}</div>
              <div className="value">{fmtPct(focus?.repeat_repair_rate)}</div>
              <div className="hint">{ui.year_default}</div>
            </div>
            <div className="kpi-card">
              <div className="label">{ui.assets}</div>
              <div className="value">{fmtNum(focus?.unique_assets)}</div>
              <div className="hint">{ui.year_default}</div>
            </div>
          </div>
          <div className="grid-2">
            <StatusPanel panel={panel2025} titleExtra=" · 2025" ui={ui} i18n={i18n} />
            <StatusPanel
              panel={panel2026}
              titleExtra={
                <>
                  {' · 2026 '}
                  <span className="badge">{i18n.status_in_progress}</span>
                </>
              }
              ui={ui}
              i18n={i18n}
            />
          </div>
          <div className="grid-2">
            <EquipmentDonut
              data={equipDonut}
              equipYear={equipYear}
              setEquipYear={setEquipYear}
              ui={ui}
            />
            <QuarterChart
              data={quarterData}
              qualityDays2024={qualityDays2024}
              ui={ui}
              i18n={i18n}
            />
          </div>
          <div className="grid-2">
            <HBar title={ui.by_branch} data={branchData} ui={ui} />
            <HBar title={ui.by_department} data={deptData} ui={ui} />
          </div>
          {(slips.length > 0 || improves.length > 0) && (
            <div className="grid-2">
              {slips.length > 0 && (
                <CompareChart title={ui.slips} data={slips} ui={ui} />
              )}
              {improves.length > 0 && (
                <CompareChart
                  title={ui.improves}
                  data={improves}
                  ui={ui}
                  highlight={COLORS.on}
                />
              )}
            </div>
          )}
          <Numbers
            ui={ui}
            i18n={i18n}
            yearKeys={yearKeys}
            data={data}
            panel2025={panel2025}
            branchData={branchData}
            deptData={deptData}
            quarterData={quarterData}
          />
        </section>

        <section className="section" aria-labelledby="sec-limits">
          <h2 className="section-title" id="sec-limits">
            {ui.sec_limits}
          </h2>
          <div className="note-card">
            <ul>
              <li>{ui.limit_helix}</li>
              <li>{ui.limit_r}</li>
              <li>{ui.limit_opens}</li>
              <li>{ui.limit_year}</li>
            </ul>
          </div>
        </section>

        <section className="section" aria-labelledby="sec-reco">
          <h2 className="section-title" id="sec-reco">
            {ui.sec_reco}
          </h2>
          <div className="note-card">
            <ol>
              <li>{ui.reco_1}</li>
              <li>{ui.reco_2}</li>
              <li>{ui.reco_3}</li>
            </ol>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <span>
            <strong>
              {ui.confidential} © Stasis
            </strong>
          </span>
          <span>
            {ui.source} Sheet4 · {ui.as_of} {asOf}
          </span>
        </div>
      </footer>
    </div>
  )
}
