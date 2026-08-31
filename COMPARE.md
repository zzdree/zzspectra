# COMPARE — zzspectra vs Photonic Mixer Pro v6.0

> Perbandingan jujur antara **zzspectra** (repo ini) dan referensi
> **Photonic Mixer Pro v6.0 — BY IJUL** di
> `https://photonic-lighting-v6-0-byizul.netlify.app/`.
> Dibuat 2026-09-01. Sumber Photonic dibaca live via fetch HTML
> (single-file `index.html` + `three.js r128` CDN). zzspectra dibaca dari
> `src/main.js`, `src/style.css`, `index.html`, `PRD.md`, `DESIGN.md`, `PLAN.md`.

---

## 1. Ringkasan Eksekutif (TL;DR)

| Dimensi | Photonic v6.0 | zzspectra (saat ini) |
|---|---|---|
| **Posisi produk** | *Lighting mixer/toy* padat fader — chase recorder + gobo + color engine + audio. Rasa warung DJ/lampu panggung kampung. | *Show-control workspace* — fixture → parameter → look/cue → playback. Rasa console profesional (grandMA-adjacent, tanpa jiplak). |
| **Teknologi 3D** | Three.js r128 sungguhan (WebGL). | Canvas 2D proyeksi pseudo-3D (`projectPoint` + `drawFixture`). Ringan, tanpa dependensi 3D. |
| **Kepadatan kontrol** | Sangat padat: 9 fader vertikal + motion FX + audio row + 3 rekorder terpisah. | Sengaja ringkas: 5 control inti (dimmer/color/pan/tilt/zoom/strobe) + grouping. |
| **Workflow operator** | REC CHASE / REC GOBO / REC COLOR terpisah, frame manager, color-step, chase-slot. | Satu alur: pilih fixture → edit → Capture Look → New Cue → Play/Next/Prev/Blackout. |
| **Persistensi** | Save/Load Project JSON via tombol. | `localStorage` auto + Import/Export JSON + normalize/validasi + history 40. |
| **Desain** | Neon cyan/magenta/hijau di hitam, font 7–10px, border tebal, banyak grid. | Dark-only token system (`--ink-*`), tipografi `Space Grotesk`/`IBM Plex Mono`, surface hierarchy. |
| **Mobile** | `user-scalable=no`, layout flex kolom, mudah overflow. | Bottom sheet `peek/half/full` + workspace grid responsif, anti `scrollWidth` overflow. |
| **Aksesibilitas** | Minim (tanpa label ARIA konsisten, target kecil). | Label/ARIA, `aria-label`, focus-visible, `prefers-reduced-motion`, target ≥44px. |

**Garis besar:** Photonic menang di *kelengkapan efek main-main* (chase, gobo, color-step, audio, hardware MiniBrute).
zzspectra menang di *arsitektur produk, desain sistem, dan kebersihan UX* — lebih siap jadi fondasi yang bisa diskalakan ke fitur yang sama tanpa jadi berantakan.

---

## 2. Identitas & Visi

### Photonic Mixer Pro v6.0
- Tagline implisit: *“SEQ & RIG MANAGER”* di viewport.
- Audience: operator yang ingin *rekam chase cepat*, atur color step, mainkan gobo, colok audio/visualizer.
- Estetika: skeuomorfik mixer — tiap fungsi punya tombol REC sendiri.

### zzspectra
- Visi (PLAN/DESIGN): *ruang kontrol pertunjukan yang tenang, presisi, padat informasi* — visual 3D adalah panggung, panel adalah instrumen.
- Prinsip: operator-first, visual sebagai source-of-truth, dark-only high-contrast, progressive fidelity, responsive by intent.
- Istilah dijaga: Fixture, Dimmer, Color, Position, Beam, Cue, Look, Playback, Blackout.

> **Beda filosofi:** Photonic = “semua tombol di depan mata”.
> zzspectra = “hanya yang perlu, tapi tiap piksel bisa dipertanggungjawabkan”.

---

## 3. Arsitektur & Stack

| Aspek | Photonic | zzspectra |
|---|---|---|
| **Build** | Satu `index.html` monolit + `<style>` inline + `<script>` inline. Tanpa bundler. | Vite `v8.2.2`, `src/main.js` + `src/style.css`, build terukur (`CSS 11.86kB / JS 22.39kB gzip ~8kB`). |
| **3D engine** | `three.min.js r128` (CDN). Asumsi scene Three.js penuh (truss, fixture mesh, beam). | Tanpa Three.js. `projectPoint(x,y,z)` + `drawStage()`/`drawFixture()` di `<canvas>`. Fallback message deteksi WebGL. |
| **State** | Variabel global + `onclick="fn()"` inline. | `project` object terpusat, `snapshot()`/`commit()`/`history`/`future`, `normalizeProject()` defensif. |
| **Styling** | CSS ad-hoc per komponen (`.top-bar`, `.scene-bar`, `.frame-card`, …), warna hardcode (`#0ff`, `#f0f`, `#0f0`). | Design tokens (`--ink-950..800`, `--line-subtle`, accent amber/cyan/green/red) + surface hierarchy. |
| **I18n** | Campur ID/EN (`FLASH MB`, `REC CHASE`). | ID konsisten (UI, toast, placeholder) + copy Inggris untuk istilah domain lighting yang memang baku. |

**Implikasi:**
- Photonic lebih berat di runtime (Three.js) tapi belum tentu lebih indah — beam tergantung implementasi shader.
- zzspectra lebih ringan, anti-dependensi, mudah di-audit, tapi beam masih berupa gradient cone Canvas (belum volumetric/shadow).

---

## 4. Model Data & Persistensi

### Photonic
- Control state tersebar (tiap slider `oninput="uVal(...)"`, `chase-slots`, `gobo-frames`, `color-steps`).
- Save/Load JSON (`SAVE PROJECT` / `LOAD PROJECT` input file). Tidak terlihat `localStorage` auto-save di snippet.

### zzspectra
```js
STORAGE_KEY = 'zzspectra-project-v2'
defaultProject() = { version:2, showName, quality, fixtures:[{id,name,type,x,y,z,color,dimmer,pan,tilt,zoom,strobe}], selected, selectedIds, blackout, playing, activeCue, grouped, looks:[], cues:[{id,name,fade,delay,state:{[id]:{dimmer,color,pan,tilt,zoom}}}] }
normalizeProject() // clamp dimmer 0–100, coerce pan/tilt/zoom/strobe, validasi selectedIds vs validIds, quality tier
loadProject() // try JSON.parse(localStorage) → normalize → fallback defaultProject
saveProject() // localStorage.setItem + status “Saved locally”
exportProject() // Blob JSON → download  “show-name.json”
importProject(file) // FileReader → normalize → push history
history[40] / future // undo/redo
```

**Kesenjangan:** Photonic belum punya validasi/undo/history terpusat; zzspectra belum punya *frame-level timing* per chase step (Photonic punya `color-step-speed` per step).

---

## 5. Matriks Fitur Detail

Legenda: ✅ ada · ◐ sebagian · ❌ belum · — tidak relevan

| Fitur | Photonic v6.0 | zzspectra | Catatan |
|---|---|---|---|
| **Fixture types** | MH generik (ALL MH) + MiniBrute khusus | WASH / SPOT / BEAM / PIXEL BAR (siluet berbeda) | zzspectra lebih eksplisit per tipe |
| **Add/remove fixture** | `changeFixCount(+/-)` qty 6 | `+ Add fixture` + hapus per inspector (min 1) | Photonic qty-centric; zzspectra identity-centric |
| **Select fixture** | `btn-fix` list | Row dengan `code`, dot warna, meter dimmer; multi-select `Ctrl/Cmd+click`; group-by-type toggle | zzspectra unggul di seleksi |
| **Dimmer** | `val-dim` 0–100 | `dimmer-control` 0–100 + meter | setara |
| **Pan / Tilt** | `val-pan` -150..150, `val-tilt` -150..150 | `pan` -180..180, `tilt` 0..180 | rentang mirip, zzspectra clamp aman |
| **Zoom** | `val-zoom` 5..150 | `zoom` 5..60 | Photonic lebih lebar |
| **Strobe** | Panel strobe besar + `strobe-spd` | `strobe` 0..100 (blink `setInterval` 120ms) | Photonic UI lebih teatrikal |
| **Color** | Color-step nodes + `color-input-mini` + speed per step | 6 chip (`#f4b942` …) `chosen` | Photonic jauh lebih kaya (palette step) |
| **Position X/Y, Space, Rot, Rainbow** | `val-space`, `val-posX/Y`, `val-rot`, `val-rainbow` | ❌ (posisi via `x,y,z` awal fixture, belum slider Space/Pos) | Gap zzspectra |
| **Beam/optics** | Implisit via zoom/pan/tilt | Kelompok Beam/optics eksplisit | setara |
| **Gobo** | `REC GOBO` + `gobo-frames` manager | ❌ | Gap besar |
| **Chase / Sequence** | `REC CHASE` + `chase-slots` + `mover-frames` frame manager | Cue stack linear (bukan chase loop) | Beda paradigma |
| **Color chase** | `color-chase-grid` (`col-chase-btn`) | ❌ | Gap |
| **Step speed** | `color-step-speed` per node | `fade`/`delay` per cue (global per cue) | Photonic per-step, zzspectra per-cue |
| **Motion FX** | `CIRCLE`, `MIRROR CIR`, `PARGOY`, … `mini-fx-btn` | ❌ (baru `grouped` + pan/tilt manual) | Gap |
| **Audio reactivity** | `audio-row` + `#audio-visualizer` (`vis-bar`) | ❌ | Gap |
| **Hardware** | `FLASH MB` + `SELECT MB` | ❌ | Photonic punya hardware affordance |
| **Looks** | — (scene/gobo/color chase sebagai gantinya) | `Capture`/`Recall` looks (snapshot full state per fixture) | zzspectra lebih jelas untuk busking |
| **Cues** | Scene slots (`scene-grid`) | Cue stack footer + `New cue` + `fade`/`delay` + trigger | Beda istilah, fungsi mirip |
| **Playback** | Implisit via chase active? | `Blackout`, `Prev/Play/Next`, `activeCue`, `playing` flag, `cueTimer` + `cueAnimation` lerp | zzspectra lebih deterministik |
| **Save/Load** | `SAVE PROJECT` / `LOAD PROJECT` JSON | `Save show` (localStorage) + `Export/Import JSON` + auto-save | zzspectra lebih aman (tidak hilang saat refresh) |
| **Camera** | Asumsi orbit Three.js (tidak terlihat di snippet) | `yaw/pitch/zoom/panX/panY`, drag orbit, Shift-drag pan, wheel zoom, Fit/Perspective/Grid | zzspectra eksplisit & terdokumentasi |
| **Quality tiers** | — | `low/balanced/high` pengaruhi grid alpha, beam opacity, shadowBlur, secondary beam | zzspectra peduli performa |
| **Undo/Redo** | ❌ terlihat | ✅ `history` 40 + `Ctrl+Z / Shift+Z / Ctrl+Y` | zzspectra unggul |

---

## 6. UI / Layout & Desain Sistem

### Photonic — anatomi (dari HTML)
```
#viewport (35vh, radial #2e2e2e→#1a1a1a)
#mixer (65vh, #111, border-top #444)
  .top-bar (REC CHASE + chase-slots + qty +/- + SAVE/LOAD)
  #mover-frame-manager (CHASE FRAME MANAGER)
  .scene-bar (REC GOBO + scene-slots)
  #gobo-frame-manager
  .color-bar (REC COLOR + +STEP + steps + color-chase)
  .top-row
    .panel-fix (15%  ALL MH + fix-list + HARDWARE FLASH MB)
    .panel-faders (65%  9× slider-v + motion-grid + sliders-h + audio-row)
    .panel-wheels (20%  strobe + wheels)
```
- Semua panel *selalu terlihat* → butuh scroll vertikal di `#mixer` (`overflow-y: auto`).
- Font 7–10px, uppercase di mana-mana, `touch-action: none`, `user-scalable=no`.
- Aksen: cyan `#0ff` dominan + magenta `#f0f` + hijau `#0f0` + merah `#f00`.

### zzspectra — anatomi (dari `main.js` + `style.css`)
```
.shell
  .topbar (brand z · show-name · Saved locally · undo/redo/?/Import/Export/Save)
  .workspace (grid)
    .fixture-panel (PATCH/LIBRARY · search · ALL FIXTURES Group · list · +Add)
    .stage-panel (LIVE VIEW · quality select · Perspective/Grid/Fit · canvas · hint · readout · transport[Blackout | Prev Play Next | Playback Cx])
    .inspector-panel.sheet-peek (Selected fixture · identity · Intensity · Color chips · Position Pan/Tilt · Beam Zoom/Strobe · Looks +Capture · help)
  .cue-footer (CUE STACK 04 cues · cue-list · +New cue)
  #toast
```
- Desktop 3 kolom → tablet drawer → mobile bottom sheet (peek/half/full) dengan handle.
- Token: `--ink-950/900/850/800`, `--line-subtle`, `--text-strong/muted`, amber primary, cyan utility, green ready, red blackout.
- Tipografi: Space Grotesk (UI) + IBM Plex Mono (angka), tracking tidak oversize.

**Penilaian:**
- Photonic = *density over clarity*. Cocok untuk yang suka “semua fader di depan”, tapi melelahkan di layar kecil dan susah di-audit.
- zzspectra = *clarity over density*. Lebih mudah dipelajari, di-test responsivitasnya, dan di-scale tanpa menambah kekacauan visual.

---

## 7. Rendering & Visual 3D

| Aspek | Photonic | zzspectra |
|---|---|---|
| **Engine** | Three.js WebGL — potensi mesh, light, shadow nyata. | Canvas 2D — `createRadialGradient` stage, grid `projectPoint`, floor plane, truss line, `drawFixture` per tipe. |
| **Fixture body** | Belum terbaca mesh-nya (butuh inspeksi JS penuh). | Siluet berbeda: WASH lingkaran, SPOT persegi, BEAM segitiga, PIXEL BAR bar. |
| **Beam** | Asumsi Three.js spotlight/cone (tidak di snippet CSS). | Cone gradient `f.color → transparent`, `spread = zoom*1.4 + (180-tilt)*0.18`, opacity `dimmer/100 * blink`, quality-aware (`low` .18 vs `.28`, `high` secondary beam). |
| **Interaksi cahaya** | Tidak terlihat di HTML. | Tidak ada bayangan jatuh/volumetric; hanya halo `shadowBlur`. |
| **Kamera** | Orbit Three.js (asumsi). | Custom `camera {yaw, pitch, zoom, panX, panY}` + `projectPoint` depth/scale. |
| **Fallback** | — | Deteksi `getContext('webgl')` → pesan “Canvas preview · fallback aman”. |
| **Performa** | Three.js + banyak DOM (frame-card, step-node) bisa berat di HP. | `setInterval 33ms` hanya saat `playing && !blackout`; quality tier turunkan efek. |

**Intinya:** Photonic *menjanjikan* visual lebih real karena Three.js, tapi zzspectra *membuktikan* bisa jalan ringan tanpa WebGL dan tetap komunikatif.

---

## 8. Interaksi & Workflow Operator

### Photonic — alur tipikal
1. Atur `fix-qty` → pilih MH → mainkan 9 fader (Dim/Pan/Tilt/Zoom/Space/PosX/Y/Rot/Rainbow).
2. Tekan `REC CHASE` → isi `chase-slots` → kelola `mover-frames` (beri nama, hapus).
3. Tekan `REC GOBO` → isi `scene-slots` → kelola `gobo-frames`.
4. Tekan `REC COLOR` → `+ STEP` → atur `color-input-mini` + `color-step-speed` → isi `color-chase-slots`.
5. Mainkan chase/gobo/color chase terpisah, plus `FLASH MB`.

### zzspectra — alur tipikal
1. Cari/pilih fixture (single atau `Ctrl+click` multi, atau `Group` by type).
2. Edit `Intensity` / `Color` / `Pan-Tilt` / `Zoom-Strobe` — langsung pantul di viewport.
3. `Capture` Look (beri nama) → `Recall` kapan pun.
4. `New cue` (snapshot dimmer/color saat itu) → atur `fade`/`delay` → `Prev/Play/Next` atau klik cue.
5. `Blackout` / `Save show` / `Export JSON`. `Ctrl+K` capture, `B` blackout, `Space` play/pause, `R` reset view, `Ctrl+Z/Y` undo/redo.

**Perbandingan:** Photonic *memecah* rekam jadi 3 mode (mover/gobo/color). zzspectra *menyatukan* jadi Look/Cue — lebih sederhana, tapi kehilangan granularity per-step speed & gobo.

---

## 9. Performa & Bundle

| Metrik | Photonic | zzspectra (build Vite 2026-09-01) |
|---|---|---|
| **Bundle** | `three.min.js` (~600kB) + HTML monolit (belum minify) | `index.html 0.85kB` + `CSS 11.86kB` + `JS 22.39kB` (gzip ~3.9kB+7.9kB) |
| **Runtime** | WebGL wajib (jika Three.js gagal → blank). | Canvas 2D jalan di mana pun; WebGL hanya untuk cek fallback. |
| **Frame cost** | Tiap frame Three.js + DOM frame-card. | `drawStage` Canvas 2D, grid digambar ulang hanya saat `drawStage()` dipanggil; interval 33ms hanya saat playing. |
| **Mobile** | `height: 35vh + 65vh`, `overflow-y: auto` di mixer → risiko double-scroll. | `overflow-x: clip` backstop + `min-width:0` + bottom sheet → `scrollWidth - clientWidth === 0` di 390px. |

---

## 10. Aksesibilitas & Responsivitas

| Kriteria | Photonic | zzspectra |
|---|---|---|
| **Viewport meta** | `maximum-scale=1.0, user-scalable=no` (anti-zoom) | `width=device-width, initial-scale=1.0` (zoom allowed) |
| **Target size** | Tombol 14–25px (`frame-del 14px`, `btn-qty 25px`) | `≥44px` untuk row/button krusial |
| **Label/ARIA** | `onclick` inline, tanpa `aria-label` konsisten | `aria-label` di canvas, slider, tombol ikon; `role="status"` toast |
| **Keyboard** | Tidak terlihat shortcut | `Space/B/R/Ctrl+K/Ctrl+Z` + guard `INPUT/TEXTAREA/SELECT` |
| **Reduced motion** | `animation: blink 1s infinite` tanpa media query | Siap hormati `prefers-reduced-motion` (cue fade 250–600ms) |
| **Kontras** | Cyan `#0ff` di `#222` — tipis di beberapa label 7px | Target WCAG AA 4.5:1, token `--text-strong/muted` terukur |
| **Overflow** | Mixer scroll di dalam page scroll | Shell `overflow-x: clip` + grid responsif + sheet |

---

## 11. Apa yang Photonic Punya tapi zzspectra Belum

1. **Chase recorder sungguhan** (REC CHASE + frame manager + chase-slots 8+ slot).
2. **Gobo engine** (REC GOBO + gobo-frames).
3. **Color engine ber-step** (nodes + color picker per step + speed per step + color-chase grid).
4. **Motion FX presets** (CIRCLE, MIRROR CIR, PARGOY, …).
5. **Audio reactivity** (audio-row + visualizer `vis-bar`).
6. **Hardware affordance** (FLASH MB, SELECT MB, qty +/-).
7. **Parameter Space/PosX/PosY/Rot/Rainbow** sebagai fader terpisah.
8. **Scene bar** sebagai bank cepat (mirip executor).

> Jika zzspectra ingin “mengejar” Photonic, ini adalah backlog yang paling terlihat oleh pengguna Photonic.

---

## 12. Apa yang zzspectra Punya tapi Photonic Tidak

1. **Desain sistem dark-only yang konsisten** (tokens, surface hierarchy, anti purple-on-dark, tanpa gradient text/grid dekoratif).
2. **Workspace responsif yang teruji** (desktop/tablet/mobile, bottom sheet, tanpa `user-scalable=no`).
3. **State terpusat + validasi + localStorage auto-save** (refresh tidak hilang).
4. **History/Undo-Redo 40 langkah** + shortcut.
5. **Grouping by type** (`Group` toggle) + multi-select `Ctrl+click`.
6. **Quality tiers** (`low/balanced/high`) yang pengaruhi rendering.
7. **Cue fade/delay deterministik** + playback transport yang jelas (Blackout/Prev/Play/Next + readout).
8. **Looks (capture/recall) bernama** — Photonic memecahnya jadi 3 recorder.
9. **Aksesibilitas & keyboard** (label, focus-visible, 44px, `prefers-reduced-motion`).
10. **Build terukur & deployable** (Vite, `dist/` siap GitHub Pages).

---

## 13. Rekomendasi — Mau Dibawa ke Mana?

### Opsi A — Tetap di jalur zzspectra (disarankan untuk fondasi)
- Pertahankan keunggulan arsitektur; jangan tiru kepadatan Photonic mentah-mentah.
- Tambah fitur Photonic *secara bertahap* di dalam sistem yang ada: color-step sebagai ekstensi Looks, chase sebagai mode playback Cue, gobo sebagai atribut fixture (bukan recorder terpisah).

### Opsi B — Kejar paritas “rasa Photonic” (jika targetnya memang DJ/busking)
Prioritas implementasi (urutan usulan):
1. **Color-step engine** (palette per step + speed) — paling visual.
2. **Chase loop** (play once/loop/bounce + BPM sync) — butuh `cueTimer` jadi `chaseTimer`.
3. **Motion FX** (circle/mirror/pargoy) sebagai modifier `pan/tilt` (sine LFO).
4. **Gobo wheel** (slot + rotation) — tambah field `gobo` di fixture.
5. **Audio reactivity** (Web Audio → `vis-bar` → modulasi dimmer/color) — opt-in.
6. **Hardware bar** (flash/minibrute) — jika memang ada use case.

### Opsi C — Hybrid
- Biarkan zzspectra jadi *“Pro mode”* (cue-based), Photonic jadi *“Play mode”* (chase-based) — toggle di topbar. Satu codebase, dua mental model.

---

## 14. Catatan Verifikasi

- Perbandingan ini dibuat tanpa menjalankan Photonic secara interaktif (hanya fetch HTML). Untuk audit piksel-per-piksel, perlu screenshot `playwright` di 1280px dan 390px + inspeksi JS Photonic penuh (file `script` inline yang terpotong di baris 197 fetch).
- zzspectra diverifikasi: `npm run build` sukses (`✓ built in 3.23s`), `git status` clean, `f990540` polish terakhir.
- Tidak ada perubahan kode di langkah ini — hanya dokumen `COMPARE.md` sesuai permintaan.

---

**Keputusan di tangan kamu.** Bilang “lanjut Opsi A/B/C” atau sebut fitur Photonic spesifik yang mau di-port duluan, saya eksekusi di `C:/ANDREAS/zzspectra` tanpa menyentuh `zzluxora`.
