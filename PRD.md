# PRD — zzspectra

**Versi:** 1.0  
**Tanggal:** 2026-09-01  
**Status:** Draft untuk prototype interaktif

## 1. Ringkasan

zzspectra adalah lighting simulator berbasis web untuk operator, programmer, pelajar, dan kreator panggung yang ingin merancang dan menguji look lighting tanpa hardware fisik. Produk memadukan viewport 3D, fixture patch sederhana, inspector parameter, look/cue capture, dan playback dalam satu workspace dark-only.

## 2. Tujuan

- Memberi feedback visual real-time saat parameter fixture diubah.
- Membuat konsep console lighting lebih mudah dipelajari.
- Menyediakan prototype yang ringan dan usable di desktop serta mobile.
- Menjadi fondasi untuk integrasi DMX/Art-Net pada fase berikutnya.

## 3. Non-goals fase pertama

- Output DMX/Art-Net/sACN ke perangkat nyata.
- Kolaborasi multi-user dan login cloud.
- Simulasi optik/fisika yang setara software profesional.
- Fixture library lengkap semua produsen.
- Audio-reactive show dan timeline musik.

## 4. Target pengguna

1. **Lighting programmer:** menguji posisi, warna, intensitas, dan cue secara cepat.
2. **Operator pemula/pelajar:** memahami hubungan parameter lighting dan hasil visual.
3. **Kreator panggung:** menyusun look awal sebelum produksi.

## 5. Feature priorities (MoSCoW)

### Must Have

- Viewport 3D stage dengan truss dan fixture awal.
- Orbit, pan, dan zoom kamera.
- Fixture selection dari viewport atau daftar.
- Kontrol dimmer, color, pan, tilt, zoom, dan strobe.
- Feedback real-time pada beam dan fixture.
- Capture/recall look sederhana.
- Playback: play, pause, next, previous, blackout.
- Penyimpanan lokal project.
- Desktop dan mobile responsive tanpa horizontal overflow.
- Keyboard focus, label kontrol, kontras, dan reduced-motion support.

### Should Have

- Fixture types: wash, spot, beam, pixel bar.
- Fixture grouping dan multi-select.
- Cue fade time dan delay.
- Preset warna/look bawaan.
- Undo/redo.
- Export/import project JSON.

### Nice to Have

- DMX channel view.
- Fixture address/patch editor.
- Timeline editor.
- Volumetric haze dan shadow quality setting.
- MIDI/OSC/Art-Net integration.

## 6. User stories dan acceptance criteria

### Epic: Explore stage

**US-001:** Sebagai pengguna, saya ingin melihat stage 3D agar dapat memahami susunan fixture.  
**AC:** Given project terbuka, when viewport selesai dimuat, then stage, truss, dan fixture terlihat dengan kamera awal yang masuk akal.

**US-002:** Sebagai pengguna, saya ingin mengorbit dan zoom kamera agar dapat menginspeksi stage.  
**AC:** Given viewport aktif, when saya drag/pinch/wheel, then kamera berubah tanpa menggeser halaman secara horizontal.

### Epic: Program fixture

**US-003:** Sebagai programmer, saya ingin memilih fixture agar dapat mengubah fixture tertentu.  
**AC:** Given beberapa fixture terlihat, when saya klik fixture atau row-nya, then fixture tersebut memiliki selection state yang jelas dan inspector menampilkan namanya.

**US-004:** Sebagai programmer, saya ingin mengubah dimmer dan warna agar dapat membuat look.  
**AC:** Given fixture terpilih, when slider/color control diubah, then beam dan visual fixture berubah sebelum kontrol kehilangan fokus.

**US-005:** Sebagai programmer, saya ingin mengubah pan, tilt, zoom, dan strobe.  
**AC:** Given fixture mendukung parameter, when parameter diubah, then arah, cone, atau efek fixture mencerminkan nilai baru.

### Epic: Capture dan playback

**US-006:** Sebagai programmer, saya ingin menyimpan look bernama agar dapat mengulanginya.  
**AC:** Given parameter fixture sudah diatur, when saya capture dengan nama valid, then look muncul dalam daftar dan dapat di-recall.

**US-007:** Sebagai programmer, saya ingin menjalankan cue berurutan.  
**AC:** Given minimal dua cue, when saya menekan next/play, then active cue berubah sesuai urutan dan state transport terlihat.

**US-008:** Sebagai operator, saya ingin blackout cepat.  
**AC:** Given stage sedang menyala, when blackout ditekan, then output visual dibuat gelap dan status blackout terlihat jelas.

### Epic: Portable workspace

**US-009:** Sebagai pengguna mobile, saya ingin mengakses kontrol utama dengan satu tangan.  
**AC:** Given viewport sekitar 390px, when saya membuka control sheet, then semua kontrol utama dapat dijangkau, target sentuh minimal 44px, dan tidak ada horizontal scrollbar.

## 7. Requirements non-fungsional

- Render utama tetap usable pada laptop kelas menengah dan mobile modern.
- Nilai state tidak bergantung langsung pada object 3D renderer.
- UI dark-only; tidak ada mode terang pada fase ini.
- Body dan horizontal rows harus diuji dengan `scrollWidth - clientWidth === 0` pada desktop, ≤1024px, dan sekitar 390px.
- Text dan kontrol memenuhi WCAG AA baseline.
- Semua aksi utama memiliki hover, focus-visible, active, disabled, dan error feedback.
- State project lokal harus divalidasi saat dibaca kembali.

## 8. Risiko

- Banyak beam/volumetric effect dapat menurunkan FPS; sediakan quality fallback.
- Mobile GPU memiliki keterbatasan; kurangi shadow dan beam density.
- Gesture viewport dapat bertabrakan dengan scroll; batasi gesture ke canvas dan sediakan reset camera.
- Istilah console dapat membingungkan pemula; gunakan label jelas dan tooltip ringkas.

## 9. Success criteria prototype

Prototype dianggap berhasil bila pengguna baru dapat membuka stage, memilih fixture, membuat perubahan dimmer/color/pan/tilt, menyimpan serta memanggil look, menjalankan cue, dan melakukan blackout dalam satu sesi tanpa bantuan teknis; flow yang sama usable pada desktop dan mobile.

## 10. Open questions

- Apakah fase lanjutan membutuhkan login/cloud sync? **Blocking untuk backend: ya; untuk prototype: tidak.**
- Apakah kompatibilitas DMX ditargetkan melalui browser gateway atau server lokal? **Blocking untuk integrasi hardware: ya.**
- Fixture library awal mana yang paling penting? **Tidak blocking; gunakan tipe generik untuk prototype.**
