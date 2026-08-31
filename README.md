# zzspectra

<p align="center">
  <strong>Shape the light. Rehearse the moment.</strong><br>
  A browser-based lighting simulator and show-control workspace.
</p>

<p align="center">
  <a href="https://zzdree.github.io/zzspectra/"><img src="https://img.shields.io/badge/▶_Open_live_demo-zzdree.github.io-F2B84B?style=for-the-badge&labelColor=17191D" alt="Open live demo"></a>
  <a href="https://github.com/zzdree/zzspectra/actions/workflows/deploy-pages.yml"><img src="https://img.shields.io/github/actions/workflow/status/zzdree/zzspectra/deploy-pages.yml?branch=main&style=for-the-badge&label=deploy" alt="Deployment status"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite 8">
  <img src="https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=111111" alt="Vanilla JavaScript">
  <img src="https://img.shields.io/badge/UI-dark--only-17191D?logo=windowsterminal&logoColor=F2B84B" alt="Dark only UI">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-Apache--2.0-2EA44F" alt="Apache 2.0 license"></a>
</p>

---

## The idea

Lighting work is spatial, visual, and fast. **zzspectra** keeps that loop close:

> **Select a fixture → shape the look → capture the cue → rehearse the playback.**

This is an evolving MVP for exploring lighting looks in the browser—without a backend, account, or API key. The visual language is inspired by professional lighting workstations while remaining an original interface, not a reproduction of any proprietary console.

## MVP at a glance

| Area | What works today |
| --- | --- |
| **Stage** | Interactive stage canvas with fixture positions, beams, and color feedback |
| **Fixtures** | Searchable fixture list with quick selection and status indicators |
| **Inspector** | Dimmer and color controls for the selected fixture |
| **Show control** | Cue stack, playback transport, and blackout safety control |
| **Workspace** | Dark-only, high-contrast responsive layout for desktop and mobile |
| **Delivery** | Automated Vite build and GitHub Pages deployment on every `main` push |

## A quick tour

```text
┌──────────────────┬────────────────────────────────┬──────────────────┐
│  FIXTURE LIBRARY │        STAGE / LIGHT VIEW      │    INSPECTOR     │
│  Search + patch  │   fixtures · beams · playback  │  dimmer · color  │
├──────────────────┴────────────────────────────────┴──────────────────┤
│                         CUE STACK + TRANSPORT                         │
└───────────────────────────────────────────────────────────────────────┘
```

The desktop layout becomes a focused, touch-friendly control surface on narrow screens. No horizontal scrolling should be necessary for the core flow.

## Try it locally

**Requirements:** Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite, usually `http://localhost:5173`.

For a production-like local preview:

```bash
npm run build
npm run preview
```

## Live deployment

The app is deployed at **[zzdree.github.io/zzspectra](https://zzdree.github.io/zzspectra/)**.

The workflow in [`deploy-pages.yml`](.github/workflows/deploy-pages.yml) runs on pushes to `main` and can also be started manually from the **Actions** tab. Vite is configured with the project base path in [`vite.config.js`](vite.config.js), so assets resolve correctly under GitHub Pages.

## Product direction

The first release is intentionally focused: a small, legible stage and a direct operator loop. The next layer adds richer simulation fidelity without sacrificing speed or clarity.

- **Now:** responsive workspace shell, fixture selection, dimmer/color, cues, playback, blackout
- **Next:** real WebGL stage, pan/tilt/zoom/strobe/beam controls, fixture types
- **Then:** named look capture, local persistence, undo/redo, JSON import/export, fixture groups

Track the full implementation sequence in [`PLAN.md`](PLAN.md), and read the product contract in [`PRD.md`](PRD.md) plus the visual contract in [`DESIGN.md`](DESIGN.md).

## Repository map

```text
zzspectra/
├── index.html                    # HTML shell + SEO metadata
├── src/
│   ├── main.js                   # MVP state, rendering, and interactions
│   └── style.css                 # Dark-only design system + responsive rules
├── .github/workflows/
│   └── deploy-pages.yml          # Build and deploy automation
├── PLAN.md                       # Roadmap and implementation checklist
├── PRD.md                        # Product requirements
├── DESIGN.md                     # Design direction and UI contract
├── vite.config.js                # GitHub Pages base path
└── LICENSE                       # Apache License 2.0
```

## Project documents

- [`PLAN.md`](PLAN.md) — milestones, critical path, checklist, and demo definition
- [`PRD.md`](PRD.md) — epics, user stories, acceptance criteria, and non-goals
- [`DESIGN.md`](DESIGN.md) — visual system, responsive gates, motion, and accessibility direction

> [!NOTE]
> zzspectra is an experimental project. The current simulator is an early MVP and the roadmap is actively evolving.

<p align="center">
  <sub>Built for curious lighting operators, designers, and developers.</sub>
</p>
