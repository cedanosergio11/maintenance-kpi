import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { COLORS, PIE_COLORS } from './theme.js'
import { fmtNum, fmtPct } from './helpers.js'
import TooltipBox from './TooltipBox.jsx'

export function DaysRepairChart({ data, qualityDays2024, ui, i18n }) {
  return (
    <div className="card">
      <h2>{ui.days_repair}</h2>
      <p className="caption">{i18n.quality_kpi}</p>
      <p className="caption">{i18n.job_weighted || ui.job_weighted}</p>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e8ea" vertical={false} />
            <XAxis dataKey="year" tick={{ fill: COLORS.gray, fontSize: 12 }} />
            <YAxis tick={{ fill: COLORS.gray, fontSize: 12 }} width={36} />
            <Tooltip content={<TooltipBox />} />
            {qualityDays2024 != null && (
              <ReferenceLine
                y={qualityDays2024}
                stroke={COLORS.gold}
                strokeDasharray="6 4"
                strokeWidth={2}
                label={{
                  value: ui.quality_line,
                  fill: COLORS.gray,
                  fontSize: 10,
                  position: 'insideTopRight',
                }}
              />
            )}
            <Bar dataKey="avg_days" name={ui.avg_days} fill={COLORS.steel} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function WipChart({ data, ui, i18n }) {
  return (
    <div className="card wip-card">
      <h2>{ui.wip_jobs}</h2>
      <p className="caption strong">{i18n.wip_disclaimer}</p>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eadfa8" vertical={false} />
            <XAxis dataKey="year" tick={{ fill: COLORS.gray, fontSize: 12 }} />
            <YAxis tick={{ fill: COLORS.gray, fontSize: 12 }} width={36} />
            <Tooltip content={<TooltipBox />} />
            <Bar dataKey="wip" name={ui.wip} radius={[4, 4, 0, 0]}>
              {data.map((r) => (
                <Cell key={r.year} fill={r.fill || COLORS.steel} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function EquipmentDonut({ data, equipYear, setEquipYear, ui }) {
  return (
    <div className="card">
      <h2>{ui.equipment_mix}</h2>
      <div className="toggle-row">
        <div className="seg">
          <button
            type="button"
            className={equipYear === '2025' ? 'active' : ''}
            onClick={() => setEquipYear('2025')}
          >
            2025
          </button>
          <button
            type="button"
            className={equipYear === '2024' ? 'active' : ''}
            onClick={() => setEquipYear('2024')}
          >
            2024
          </button>
        </div>
      </div>
      <div className="chart-wrap tall">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="48%"
              innerRadius="48%"
              outerRadius="72%"
              paddingAngle={2}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v, name, item) => [
                `${fmtNum(v)} (${fmtPct(item?.payload?.share ?? 0)})`,
                name,
              ]}
            />
            <Legend verticalAlign="bottom" height={48} wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function QuarterChart({ data, qualityDays2024, ui, i18n }) {
  return (
    <div className="card">
      <h2>{ui.by_quarter}</h2>
      <p className="caption">{i18n.quality_kpi}</p>
      <div className="chart-wrap tall">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e8ea" vertical={false} />
            <XAxis dataKey="quarter" tick={{ fill: COLORS.gray, fontSize: 12 }} />
            <YAxis tick={{ fill: COLORS.gray, fontSize: 12 }} width={36} />
            <Tooltip content={<TooltipBox />} />
            {qualityDays2024 != null && (
              <ReferenceLine
                y={qualityDays2024}
                stroke={COLORS.gold}
                strokeDasharray="6 4"
                strokeWidth={2}
              />
            )}
            <Bar dataKey="avg_days" name={ui.avg_days} fill={COLORS.steel} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function HBar({ title, data, ui }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="chart-wrap tall">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={data} margin={{ top: 4, right: 12, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e8ea" horizontal={false} />
            <XAxis type="number" tick={{ fill: COLORS.gray, fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey="name"
              width={88}
              tick={{ fill: COLORS.gray, fontSize: 11 }}
            />
            <Tooltip content={<TooltipBox />} />
            <Bar dataKey="avg_days" name={ui.avg_days} fill={COLORS.steel} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function CompareChart({ title, data, ui, highlight }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="chart-wrap tall">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 48 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e8ea" vertical={false} />
            <XAxis
              dataKey="name"
              interval={0}
              angle={-25}
              textAnchor="end"
              height={60}
              tick={{ fill: COLORS.gray, fontSize: 9 }}
            />
            <YAxis tick={{ fill: COLORS.gray, fontSize: 12 }} width={36} />
            <Tooltip content={<TooltipBox />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="d24" name={ui.d24} fill={COLORS.silver} radius={[3, 3, 0, 0]} />
            <Bar
              dataKey="d25"
              name={ui.d25}
              fill={highlight || COLORS.steel}
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
