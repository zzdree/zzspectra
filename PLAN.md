# PLAN — zzspectra

**Status:** Draft v1.0  
**Tanggal:** 2026-09-01  
**Produk:** Web-based 3D lighting simulator dan show-control workspace

## Visi

Membangun workstation lighting berbasis browser yang memungkinkan operator membuat layout panggung, mengatur fixture, melihat hasil secara real-time dalam 3D, dan menguji cue lighting dari desktop maupun mobile.

## Prinsip Produk

1. **Operator-first:** pilih fixture → ubah parameter → simpan look/cue → playback.
2. **Visual sebagai sumber kebenaran:** perubahan kontrol langsung terlihat di 3D view.
3. **Dark-only dan high contrast:** nyaman untuk ruang gelap, dengan warna aksen yang bermakna.
4. **Progressive fidelity:** mulai ringan, lalu tambah beam, volumetric effect, shadow, dan fixture kompleks.
5. **Responsive by intent:** desktop memakai workspace multi-panel; mobile memakai 3D view dan bottom-sheet controls.

## Critical Path

Project foundation → 3D stage viewport → fixture data model → fixture selection/transform → lighting parameters → cue/playback state → responsive control surface → visual/performance QA.

## Milestones

### M0 — Product foundation (S)
Repository, PRD, design contract, app shell, development workflow.

### M1 — Interactive 3D stage (M)
Stage/truss, camera orbit/pan/zoom, selectable fixtures, basic beam visualization.

### M2 — Lighting control core (L)
Fixture library, dimmer, color, pan/tilt, zoom, strobe, parameter feedback.

### M3 — Show control (L)
Looks, cues, playback timeline, save/load project state locally.

### M4 — Responsive operator workspace (M)
Desktop multi-panel layout, tablet adaptation, mobile bottom sheet and touch controls.

### M5 — Polish and release gate (M)
Performance tuning, accessibility, empty/error states, visual QA, documentation, first deployable build.

## Implementation Checklist

### Foundation / Infra

- [ ] 1.1 App shell and package configuration — **DoD:** app starts locally with documented command — [LOW]
- [ ] 1.2 Dark-only CSS design tokens — **DoD:** surfaces, text, states, spacing, and focus styles use named tokens — [LOW]
- [ ] 1.3 Lint/type/test baseline — **DoD:** validation command exits successfully — [LOW]

### Data

- [ ] 2.1 Fixture model — **DoD:** each fixture has identity, type, transform, and normalized lighting parameters — [MED]
- [ ] 2.2 Stage/project model — **DoD:** stage, fixtures, looks, cues, and metadata serialize — [MED]
- [ ] 2.3 Local persistence — **DoD:** refresh restores the last saved project safely — [MED]

### 3D Rendering

- [ ] 3.1 Stage and truss scene — **DoD:** camera can inspect a readable stage layout — [MED]
- [ ] 3.2 Orbital camera controls — **DoD:** pointer and touch support orbit, pan, zoom without page overflow — [MED]
- [ ] 3.3 Fixture visual bodies — **DoD:** supported fixture types are visually distinct — [MED]
- [ ] 3.4 Beam/light representation — **DoD:** intensity, color, pan, tilt, zoom visibly change the viewport — [HIGH]
- [ ] 3.5 Selection feedback — **DoD:** selected fixture is highlighted and exposes controls — [MED]
- [ ] 3.6 Performance safeguards — **DoD:** expensive effects reduce under a documented threshold — [HIGH]

### Control Logic

- [ ] 4.1 Parameter editing — **DoD:** controls update selected fixture and viewport in one interaction — [MED]
- [ ] 4.2 Fixture patch/library — **DoD:** users add, remove, and select supported fixture types — [MED]
- [ ] 4.3 Look capture — **DoD:** current states can be captured and recalled by name — [MED]
- [ ] 4.4 Cue sequencing — **DoD:** cues are ordered and triggered deterministically — [HIGH]
- [ ] 4.5 Playback transport — **DoD:** play, pause, next, previous, blackout show feedback — [MED]

### UI / QA

- [ ] 5.1 Desktop workspace — **DoD:** viewport, fixture list, inspector, and transport are usable — [MED]
- [ ] 5.2 Mobile workspace — **DoD:** essential controls use ≥44px targets and no horizontal overflow — [MED]
- [ ] 5.3 Inspector groups — **DoD:** Dimmer, Color, Position, Beam, Effects are clearly grouped — [LOW]
- [ ] 5.4 Keyboard shortcuts — **DoD:** documented shortcuts work without hijacking text input — [MED]
- [ ] 5.5 Empty/loading/error states — **DoD:** recovery actions are clearly explained — [MED]
- [ ] 6.1 Automated core state tests — **DoD:** editing, looks, cues, playback, blackout are covered — [MED]
- [ ] 6.2 Responsive checks — **DoD:** desktop/tablet/390px layouts pass scrollWidth overflow check — [MED]
- [ ] 6.3 Visual critique loop — **DoD:** rendered screenshots are reviewed at wide and narrow widths — [MED]
- [ ] 6.4 Accessibility pass — **DoD:** focus, labels, contrast, reduced motion, touch targets pass baseline — [MED]

## Blocked Items

- Backend/cloud collaboration is deferred; confirm scope before adding accounts or a server.
- Exact fixture library and DMX/Art-Net compatibility are future decisions, not required for the first prototype.

## First Demo Definition

A user can open zzspectra, inspect a small stage in 3D, select a fixture, change dimmer/color/pan/tilt, capture a look, trigger it, and use the same flow on a phone without horizontal scrolling.