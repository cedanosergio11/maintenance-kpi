import { fmtNum, fmtPct } from './helpers.js'

export default function Numbers({
  ui,
  i18n,
  yearKeys,
  data,
  panel2025,
  branchData,
  deptData,
  quarterData,
}) {
  return (
    <section className="numbers">
      <details>
        <summary>{ui.show_numbers}</summary>

        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>{ui.year}</th>
                <th className="num">{ui.closed_col}</th>
                <th className="num">{ui.avg_col}</th>
                <th className="num">{ui.wip}</th>
                <th className="num">{ui.repeat}</th>
                <th className="num">{ui.assets}</th>
              </tr>
            </thead>
            <tbody>
              {yearKeys.map((y) => {
                const yr = data.years[y]
                return (
                  <tr key={y}>
                    <td>{y}</td>
                    <td className="num">{fmtNum(yr.closed)}</td>
                    <td className="num">{fmtNum(yr.avg_days, 2)}</td>
                    <td className="num">
                      {y === '2026'
                        ? `${fmtNum(yr.wip_ytd ?? yr.wip, 2)} YTD / ${fmtNum(yr.wip_annualized, 2)} ann.`
                        : fmtNum(yr.wip, 2)}
                    </td>
                    <td className="num">{fmtPct(yr.repeat_repair_rate)}</td>
                    <td className="num">{fmtNum(yr.unique_assets)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {panel2025?.rows?.length > 0 && (
          <div className="table-wrap">
            <p className="caption strong">2025 · {ui.template}</p>
            <p className="caption">{i18n.job_weighted || ui.unweighted}</p>
            <table className="data">
              <thead>
                <tr>
                  <th>{ui.template}</th>
                  <th className="num">{ui.closed_col}</th>
                  <th className="num">{ui.avg_col}</th>
                  <th className="num">{ui.target_col}</th>
                  <th>{ui.status_col}</th>
                </tr>
              </thead>
              <tbody>
                {panel2025.rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.label}</td>
                    <td className="num">{fmtNum(r.closed)}</td>
                    <td className="num">{fmtNum(r.avg_days, 2)}</td>
                    <td className="num">{fmtNum(r.target, 2)}</td>
                    <td>
                      {r.status === 'on'
                        ? i18n.status_on
                        : r.status === 'off'
                          ? i18n.status_off
                          : r.status === 'absent'
                            ? i18n.status_absent || ui.no_baseline
                            : i18n.status_insufficient}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {branchData.length > 0 && (
          <div className="table-wrap">
            <p className="caption strong">2025 · {ui.branch}</p>
            <table className="data">
              <thead>
                <tr>
                  <th>{ui.branch}</th>
                  <th className="num">{ui.closed_col}</th>
                  <th className="num">{ui.avg_col}</th>
                </tr>
              </thead>
              <tbody>
                {branchData.map((r) => (
                  <tr key={r.name}>
                    <td>{r.name}</td>
                    <td className="num">{fmtNum(r.closed)}</td>
                    <td className="num">{fmtNum(r.avg_days, 2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {deptData.length > 0 && (
          <div className="table-wrap">
            <p className="caption strong">2025 · {ui.department}</p>
            <table className="data">
              <thead>
                <tr>
                  <th>{ui.department}</th>
                  <th className="num">{ui.closed_col}</th>
                  <th className="num">{ui.avg_col}</th>
                </tr>
              </thead>
              <tbody>
                {deptData.map((r) => (
                  <tr key={r.name}>
                    <td>{r.name}</td>
                    <td className="num">{fmtNum(r.closed)}</td>
                    <td className="num">{fmtNum(r.avg_days, 2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {quarterData.length > 0 && (
          <div className="table-wrap">
            <p className="caption strong">2025 · {ui.quarter}</p>
            <table className="data">
              <thead>
                <tr>
                  <th>{ui.quarter}</th>
                  <th className="num">{ui.closed_col}</th>
                  <th className="num">{ui.avg_col}</th>
                </tr>
              </thead>
              <tbody>
                {quarterData.map((r) => (
                  <tr key={r.quarter}>
                    <td>{r.quarter}</td>
                    <td className="num">{fmtNum(r.closed)}</td>
                    <td className="num">{fmtNum(r.avg_days, 2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </details>
    </section>
  )
}
