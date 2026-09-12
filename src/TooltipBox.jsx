import { COLORS } from './theme.js'
import { fmtNum } from './helpers.js'

export default function TooltipBox({ active, payload, label, labelFormatter }) {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e4e4e6',
        borderRadius: 8,
        padding: '0.45rem 0.65rem',
        fontSize: 12,
      }}
    >
      <div style={{ fontWeight: 650, marginBottom: 4 }}>
        {labelFormatter ? labelFormatter(label) : label}
      </div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ color: p.color || COLORS.steel }}>
          {p.name}: {fmtNum(p.value, typeof p.value === 'number' && p.value % 1 ? 1 : 0)}
        </div>
      ))}
    </div>
  )
}
