export function fmtNum(n, digits = 0) {
  if (n == null || Number.isNaN(n)) return '—'
  return Number(n).toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })
}

export function fmtPct(rate) {
  if (rate == null || Number.isNaN(rate)) return '—'
  return `${(rate * 100).toLocaleString(undefined, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  })}%`
}

export function sortedYears(yearsObj) {
  return Object.keys(yearsObj || {}).sort((a, b) => Number(a) - Number(b))
}

export function labelMap(list) {
  const m = {}
  for (const item of list || []) {
    if (item?.id) m[item.id] = item.label || item.id
  }
  return m
}

export function templateStatus(row, year2024Row, minN) {
  const closed = row?.closed ?? 0
  let target = row?.target_2024
  if (target == null && year2024Row && !year2024Row.absent) {
    target = year2024Row.quality_days ?? year2024Row.target_2024 ?? null
  }
  if (row?.absent || year2024Row?.absent) {
    return { status: 'absent', target: null, closed: closed || 0, avg_days: null }
  }
  if (target == null) {
    return { status: 'absent', target: null, closed, avg_days: row?.avg_days ?? null }
  }
  if (closed < minN) {
    return { status: 'insufficient', target, closed, avg_days: row?.avg_days ?? null }
  }
  if ((row?.avg_days ?? Infinity) <= target) {
    return { status: 'on', target, closed, avg_days: row.avg_days }
  }
  return { status: 'off', target, closed, avg_days: row.avg_days }
}

export function buildTemplatePanel(yr, y2024, templates, minN) {
  if (!yr?.by_template) return null
  const counts = { on: 0, off: 0, insufficient: 0, absent: 0 }
  const offList = []
  const absentList = []
  const rows = []
  for (const [id, row] of Object.entries(yr.by_template)) {
    const base = y2024?.by_template?.[id]
    const s = templateStatus(row, base, minN)
    counts[s.status] = (counts[s.status] || 0) + 1
    const label = templates[id] || id
    rows.push({ id, label, ...s, ...row })
    if (s.status === 'off') {
      offList.push({
        id,
        label,
        avg_days: s.avg_days,
        target: s.target,
        closed: s.closed,
      })
    }
    if (s.status === 'absent') {
      absentList.push({ id, label, closed: s.closed })
    }
  }
  offList.sort((a, b) => b.avg_days - b.target - (a.avg_days - a.target))
  rows.sort((a, b) => (b.closed || 0) - (a.closed || 0))
  return { counts, offList, absentList, rows }
}

export function wipRows(years, yearKeys, colors) {
  const rows = []
  for (const y of yearKeys) {
    const yr = years[y]
    if (!yr) continue
    if (y === '2026') {
      const ytd = yr.wip_ytd ?? yr.wip
      const ann = yr.wip_annualized
      if (ytd != null) rows.push({ year: '2026 YTD', wip: ytd, fill: colors.steel })
      if (ann != null) rows.push({ year: '2026 ann.', wip: ann, fill: colors.gold })
    } else if (yr.wip != null) {
      rows.push({ year: y, wip: yr.wip, fill: colors.steel })
    }
  }
  return rows
}
