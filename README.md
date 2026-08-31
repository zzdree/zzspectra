# zzspectra

[![Deploy to GitHub Pages](https://github.com/zzdree/zzspectra/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/zzdree/zzspectra/actions/workflows/deploy-pages.yml)
[![Built with Vite](https://img.shields.io/badge/built%20with-Vite-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Vanilla JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=111111)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/license-private-lightgrey)](https://github.com/zzdree/zzspectra)

> **A focused browser workspace for designing and rehearsing lighting looks.**

**Live preview:** [zzspectra on GitHub Pages](https://zzdree.github.io/zzspectra/)

zzspectra is an experimental web-based lighting simulator and show-control workspace. It is designed for quickly shaping lighting looks, rehearsing cue ideas, and exploring a responsive console-inspired workflow directly in the browser.

It takes inspiration from professional lighting workstations without copying proprietary trademarks, icons, or interface layouts.

## What is inside

- Interactive stage viewport with fixture beams and color feedback
- Fixture browser with searchable fixtures and quick selection
- Inspector controls for dimmer and color
- Cue stack and transport controls for rehearsal
- Blackout control for immediate output safety
- Dark-only, high-contrast interface
- Responsive layout for desktop and mobile screens
- Static deployment with no backend or API key required

> The current repository is an actively evolving MVP. More fixture types, true 3D controls, look capture, persistence, and undo/redo are planned in the roadmap.

## Run locally

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

To create a production build locally:

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

The repository includes a GitHub Actions workflow at [deploy-pages.yml](.github/workflows/deploy-pages.yml). Every push to `main` builds the Vite app and publishes the `dist` directory to GitHub Pages.

To enable it manually in GitHub:

1. Open **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Push to `main` or run the **Deploy to GitHub Pages** workflow manually.

The expected public URL is:

```text
https://zzdree.github.io/zzspectra/
```

## Project documents

- [BIG-PLAN.md](BIG-PLAN.md) — phased roadmap, milestones, risks, and success criteria
- [PRD.md](PRD.md) — product requirements, epics, user stories, and acceptance criteria
- [DESIGN.md](DESIGN.md) — visual direction, responsive rules, and interaction contract

## Project structure

```text
zzspectra/
├── index.html
├── src/
│   ├── main.js
│   └── style.css
├── .github/workflows/
├── BIG-PLAN.md
├── PRD.md
└── DESIGN.md
```

## Roadmap

- [x] Initial responsive lighting workspace shell
- [x] Fixture selection, dimmer, color, cue stack, playback, and blackout foundation
- [x] Automated GitHub Pages deployment
- [ ] Real 3D/WebGL viewport
- [ ] Pan, tilt, zoom, strobe, beam, and fixture-type controls
- [ ] Capture/recall looks and local project persistence
- [ ] Undo/redo and JSON import/export
- [ ] Fixture groups and multi-select
- [ ] Mobile-first visual QA pass

## License

All rights reserved. This repository is private and is not currently distributed under an open-source license.
