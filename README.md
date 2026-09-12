# Maintenance KPI

Static GitHub Pages dashboard. Quality target is **2024 days/repair** per template. Implied WIP is **closed × avg days ÷ calendar period days** (jobs-in-process on a typical day), not a quality line.

Live: https://cedanosergio11.github.io/maintenance-kpi/

Data file: `public/kpi-dashboard-data.json` (copied into the Pages artifact).

## Pages

Same pattern as [mpd-360-pill-calculator](https://github.com/cedanosergio11/mpd-360-pill-calculator):

- Repo **Settings → Pages → Source = GitHub Actions** (not Deploy from a branch).
- `npm run build:pages` writes `dist/client` (index + `404.html` + JSON).
- Base path `/maintenance-kpi/`.

```
npm run build:pages
```
