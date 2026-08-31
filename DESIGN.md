# DESIGN — zzspectra

**Versi:** 1.0  
**Tanggal:** 2026-09-01  
**Arah:** dark-only lighting workstation, terinspirasi console profesional seperti grandMA3 tanpa menyalin identitas, aset, atau layout proprietary.

## 1. Design north star

zzspectra harus terasa seperti **ruang kontrol pertunjukan**: tenang, presisi, padat informasi, dan responsif. Visual 3D adalah panggung; panel kontrol adalah instrumen kerja. Tidak memakai dekorasi yang mengalahkan fungsi.

## 2. Layout architecture

### Desktop (≥1200px)

- **Top bar 48–56px:** wordmark zzspectra, project name, save state, quality, help.
- **Left rail 240–280px:** fixture groups, fixture list, search, patch/add actions.
- **Center viewport:** dominant 3D stage; camera toolbar floating di sisi dalam viewport.
- **Right inspector 300–360px:** selected fixture identity dan parameter groups.
- **Bottom transport 64–88px:** blackout, previous, play/pause, next, cue/look status.

### Tablet (768–1199px)

- Left rail dapat collapse menjadi drawer.
- Inspector tetap visible tetapi lebih ramping atau menjadi tab.
- Bottom transport selalu accessible.

### Mobile (≤767px)

- Top bar ringkas dengan project title dan menu.
- Viewport berada di bagian atas sebagai area utama.
- Controls dibuka sebagai bottom sheet dengan snap states: peek, half, full.
- Fixture list dan inspector menjadi tab/drawer; essential controls tetap satu tap dari viewport.
- Jangan memaksa tiga kolom desktop menjadi tumpukan panjang.

## 3. Visual language

### Surface hierarchy

- `--ink-950`: background utama, hampir hitam dengan tint biru-abu.
- `--ink-900`: shell/sidebar.
- `--ink-850`: panel dan inspector.
- `--ink-800`: elevated controls.
- `--line-subtle`: divider halus, bukan colored border accent.
- `--text-strong`: label penting.
- `--text-muted`: metadata dan helper copy.

Gunakan kedalaman lewat perbedaan surface, inset highlight tipis, dan shadow lembut; hindari nested card berlebihan.

### Accent system

- **Amber/gold:** active selection, cue/playback, primary action; merujuk rasa console lighting.
- **Cyan:** informational/camera/viewport utility.
- **Green:** saved/online/ready.
- **Red:** blackout, destructive, fault.
- **Magenta/blue-violet:** hanya sebagai warna hasil beam di viewport, bukan aksen teks utama.

Accent dipakai sebagai signal, bukan untuk mewarnai seluruh UI.

## 4. Typography

- UI/display: `Space Grotesk` atau font sans modern dengan angka yang jelas.
- Data/technical values: `IBM Plex Mono` atau monospace yang mudah dibaca.
- H1/wordmark tidak oversized; gunakan tracking rapat namun tetap terbaca.
- Label uppercase hanya untuk kategori kecil, bukan semua teks.
- Angka parameter harus prominent agar cepat dipindai operator.

## 5. Component contract

### Fixture row
Menampilkan nomor, nama, tipe, mini status color, dimmer percentage, dan selected state. Row minimal 44px pada mobile.

### Parameter group
Header ringkas + control rows konsisten. Setiap slider memiliki label, value display, min/max semantics, keyboard adjustment, dan focus-visible state.

### Viewport toolbar
Reset camera, grid/stage toggle, quality, isolate/fit selection. Toolbar tidak boleh menghalangi beam utama.

### Transport
Blackout berbentuk tombol besar dengan kontras tinggi namun tidak selalu merah menyala. Play/pause dan cue navigation memiliki state yang tegas.

### Bottom sheet mobile
Handle yang jelas, drag-friendly, heading sticky, footer action tetap terlihat. Hindari sheet yang menutup semua context tanpa cara kembali ke viewport.

## 6. Interaction and motion

- Hover: perubahan surface 120–160ms.
- Press: feedback segera, tanpa bounce.
- Panel open/close: ease-out 180–240ms.
- Cue transition: 250–600ms sesuai fade time, tetapi hormati `prefers-reduced-motion`.
- Selection: outline/halo amber yang halus di fixture; jangan pakai glow berlebihan pada seluruh panel.
- Semua focus state harus terlihat jelas dalam dark theme.

## 7. 3D viewport direction

- Stage gelap dengan floor plane dan garis referensi sangat halus.
- Truss memakai material metal matte; fixture body memiliki siluet berbeda per tipe.
- Beam terlihat sebagai cone transparan berwarna dengan opacity berdasarkan dimmer.
- Default camera tiga perempat dari depan, cukup ruang untuk inspeksi.
- Gunakan orbital camera untuk editor feel.
- Sediakan quality tiers: low (fixture glow sederhana), balanced (beam + selective shadow), high (volumetric/soft shadow bila device mampu).
- Hindari real-time shadow untuk semua fixture di mobile.

## 8. Responsive and accessibility gates

- `body { overflow-x: clip; }` sebagai backstop, bukan pengganti perbaikan layout.
- Header, toolbar, dan row boleh wrap; children flex/grid wajib `min-width: 0`.
- Ukur `document.documentElement.scrollWidth - document.documentElement.clientWidth` pada desktop, 1024px, dan 390px; hasil wajib 0.
- Interactive target minimal 44×44px.
- Contrast teks body target WCAG AA 4.5:1.
- Canvas memiliki accessible label dan fallback instruction untuk keyboard users.
- Slider dan button dapat dioperasikan keyboard.

## 9. Visual QA loop

1. Jalankan app pada viewport desktop, tablet, dan mobile.
2. Screenshot rendered page, bukan hanya membaca source.
3. Periksa collision, alignment, hierarchy, focus, empty/error states, dan task flow.
4. Jalankan overflow check dan ukur hasilnya.
5. Review screenshot dengan mata segar; metric hanya signal, bukan pengganti judgment.
6. Perbaiki root cause lalu ulangi screenshot dan check.

## 10. Brand voice

- Ringkas, tenang, teknis, tidak sok futuristik.
- Gunakan istilah familiar: Fixture, Dimmer, Color, Position, Beam, Cue, Look, Playback, Blackout.
- Error copy harus actionable: “WebGL tidak tersedia. Turunkan quality atau buka browser yang mendukung WebGL.”

## 11. Anti-patterns

- Tidak memakai light mode pada fase ini.
- Tidak memakai purple-on-dark sebagai warna brand utama.
- Tidak menggunakan gradient text, grid background dekoratif, atau bento cards yang tidak berhubungan.
- Tidak menyembunyikan kontrol penting hanya pada hover.
- Tidak memakai ikon tanpa label/tooltips untuk aksi kritis.
- Tidak meniru trademark, ikon, aset, atau UI proprietary grandMA3 secara literal.
