# zzspectra

<p align="center">
  <strong>Shape the light. Rehearse the moment.</strong><br>
  Simulator lighting dan workspace show-control langsung di browser.
</p>

<p align="center">
  <a href="https://zzdree.github.io/zzspectra/"><img src="https://img.shields.io/badge/▶_Buka_live_demo-zzdree.github.io-F2B84B?style=for-the-badge&labelColor=17191D" alt="Buka live demo"></a>
  <a href="https://github.com/zzdree/zzspectra/actions/workflows/deploy-pages.yml"><img src="https://img.shields.io/github/actions/workflow/status/zzdree/zzspectra/deploy-pages.yml?branch=main&style=for-the-badge&label=deployment" alt="Status deployment"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite 8">
  <img src="https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=111111" alt="Vanilla JavaScript">
  <img src="https://img.shields.io/badge/UI-dark--only-17191D?logo=windowsterminal&logoColor=F2B84B" alt="Dark only UI">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-Apache--2.0-2EA44F" alt="Lisensi Apache 2.0"></a>
</p>

<p align="center">
  <a href="https://zzdree.github.io/zzspectra/">Live Demo</a> ·
  <a href="PLAN.md">Rencana Pengembangan</a> ·
  <a href="PRD.md">PRD</a> ·
  <a href="DESIGN.md">Design Contract</a>
</p>

---

## Tentang zzspectra

Pekerjaan lighting itu **spasial, visual, dan serba cepat**. zzspectra dibuat untuk menjaga jarak antara ide dan hasil tetap pendek: buka browser, pilih fixture, bentuk suasana, lalu uji cue tanpa harus menyiapkan workstation yang rumit.

zzspectra adalah proyek eksperimental untuk membangun simulator lighting dan workspace show-control yang ringan, responsif, dan nyaman digunakan di ruang gelap. Antarmukanya mengambil inspirasi dari alur kerja lighting profesional, tetapi seluruh tampilan dan implementasinya dibuat sebagai interface orisinal.

### Alur kerja utama

> **Pilih fixture → atur look → susun cue → jalankan playback → evaluasi hasilnya.**

Tidak perlu backend, akun, database, atau API key untuk mencoba MVP ini.

## Kenapa proyek ini dibuat?

Banyak ide lighting dimulai dari percobaan kecil: satu fixture, satu warna, satu perubahan intensitas, lalu berkembang menjadi sebuah look. zzspectra memfokuskan pengalaman pada loop tersebut.

- **Cepat untuk bereksperimen** — langsung masuk ke stage dan kontrol utama.
- **Visual sebagai sumber kebenaran** — perubahan parameter dirancang agar segera terlihat.
- **Aman untuk rehearsal** — tersedia kontrol blackout untuk mematikan output secara langsung.
- **Fokus pada operator** — fixture, inspector, cue stack, dan transport punya hierarki yang jelas.
- **Siap dibuka di mana saja** — berbasis web dan dapat diakses dari desktop maupun mobile.

## Fitur yang tersedia saat ini

| Bagian | Kemampuan |
| --- | --- |
| **Stage view** | Canvas stage interaktif dengan posisi fixture, beam, dan feedback warna |
| **Fixture library** | Daftar fixture yang dapat dicari dan dipilih dengan cepat |
| **Inspector** | Kontrol dimmer dan warna untuk fixture terpilih |
| **Cue stack** | Daftar cue untuk menyusun urutan perubahan lighting |
| **Playback** | Kontrol play, pause, next, dan previous untuk rehearsal |
| **Blackout** | Tombol keselamatan untuk mematikan seluruh output lighting |
| **Responsive UI** | Workspace yang beradaptasi untuk desktop, tablet, dan layar kecil |
| **Deployment** | Build otomatis Vite dan deploy GitHub Pages setiap push ke `main` |

> [!TIP]
> Cara tercepat mencoba aplikasi: buka [live demo](https://zzdree.github.io/zzspectra/), pilih fixture dari panel kiri, lalu ubah dimmer atau warna melalui inspector.

## Tur singkat antarmuka

```text
┌──────────────────┬────────────────────────────────┬──────────────────┐
│  FIXTURE LIBRARY │          STAGE / LIGHT VIEW    │    INSPECTOR     │
│  Cari + pilih    │    fixture · beam · playback   │  dimmer · warna  │
├──────────────────┴────────────────────────────────┴──────────────────┤
│                         CUE STACK + TRANSPORT                         │
└───────────────────────────────────────────────────────────────────────┘
```

Di layar lebar, workspace menampilkan beberapa panel sekaligus agar operator dapat melihat konteks. Di layar kecil, layout dipadatkan menjadi control surface yang lebih fokus dan touch-friendly. Targetnya: alur utama tetap dapat dijalankan tanpa horizontal scrolling.

## Status proyek

| Status | Keterangan |
| --- | --- |
| ✅ **MVP aktif** | Shell workspace, fixture selection, dimmer, warna, cue, playback, dan blackout sudah tersedia |
| 🚧 **Sedang dikembangkan** | Simulator 3D/WebGL yang lebih nyata dan parameter fixture yang lebih lengkap |
| 🧭 **Direncanakan** | Capture look, persistence lokal, undo/redo, export JSON, dan fixture groups |
| 🌐 **Sudah online** | Tersedia melalui GitHub Pages dengan deployment otomatis |

## Coba di komputer lokal

### Prasyarat

- Node.js **20 atau lebih baru**
- npm
- Git, jika ingin ikut mengembangkan project

### Instalasi dan development server

```bash
git clone https://github.com/zzdree/zzspectra.git
cd zzspectra
npm install
npm run dev
```

Buka alamat yang ditampilkan Vite, biasanya:

```text
http://localhost:5173
```

### Build dan preview production

Gunakan perintah berikut untuk membuat build production dan menjalankan preview lokal:

```bash
npm run build
npm run preview
```

Build akan menghasilkan folder `dist/` yang siap disajikan oleh static hosting.

## Deployment ke GitHub Pages

zzspectra sudah dikonfigurasi untuk deploy otomatis ke:

**[https://zzdree.github.io/zzspectra/](https://zzdree.github.io/zzspectra/)**

Workflow deployment berada di [`deploy-pages.yml`](.github/workflows/deploy-pages.yml) dan bekerja dengan alur berikut:

1. GitHub Actions checkout source code.
2. Node.js disiapkan dan dependency di-install dengan `npm ci`.
3. Aplikasi dibuild menggunakan `npm run build`.
4. Folder `dist/` diunggah sebagai Pages artifact.
5. Artifact dipublish ke GitHub Pages.

Setiap push ke branch `main` akan memicu deployment baru. Workflow juga dapat dijalankan manual dari tab **Actions**.

Base path GitHub Pages dikonfigurasi di [`vite.config.js`](vite.config.js), sehingga asset tetap ditemukan saat aplikasi berjalan di subpath `/zzspectra/`.

## Arah pengembangan

zzspectra sengaja dimulai dari pengalaman inti yang sederhana: stage yang mudah dibaca dan loop operator yang langsung. Setelah fondasinya stabil, fidelity simulasi dapat ditambah secara bertahap.

### Fase saat ini — Workspace foundation

- Layout workspace responsif
- Fixture selection dan searchable fixture list
- Kontrol dimmer dan warna
- Cue stack dan playback transport
- Blackout safety control
- Pipeline build dan deployment otomatis

### Fase berikutnya — Simulasi lighting lebih dalam

- Stage 3D berbasis WebGL
- Orbit, pan, zoom, dan camera controls
- Pan, tilt, zoom, strobe, dan beam controls
- Beragam tipe fixture dengan visual yang berbeda
- Feedback intensitas dan perubahan parameter yang lebih realistis

### Fase lanjutan — Show workflow

- Capture dan recall look berdasarkan nama
- Penyimpanan project secara lokal
- Undo/redo
- Import/export JSON
- Fixture groups dan multi-select
- Keyboard shortcuts untuk operator

Detail milestone, dependency, definition of done, dan risiko tersedia di [`PLAN.md`](PLAN.md).

## Struktur repository

```text
zzspectra/
├── index.html                    # HTML shell, metadata, dan entry point
├── src/
│   ├── main.js                   # State MVP, rendering, dan interaksi UI
│   └── style.css                 # Design system dark-only dan responsive rules
├── .github/workflows/
│   └── deploy-pages.yml          # Automasi build dan GitHub Pages
├── PLAN.md                       # Roadmap dan implementation checklist
├── PRD.md                        # Product requirements dan acceptance criteria
├── DESIGN.md                     # Arah visual dan UI contract
├── vite.config.js                # Konfigurasi base path GitHub Pages
├── package.json                  # Script dan dependency project
└── LICENSE                       # Apache License 2.0
```

## Dokumentasi project

- [`PLAN.md`](PLAN.md) — visi, prinsip produk, milestone, critical path, checklist, dan definisi demo pertama.
- [`PRD.md`](PRD.md) — epics, user stories, acceptance criteria, non-goals, dan risiko produk.
- [`DESIGN.md`](DESIGN.md) — visual direction, token, layout responsif, motion, dan accessibility direction.
- [`deploy-pages.yml`](.github/workflows/deploy-pages.yml) — konfigurasi deployment otomatis ke GitHub Pages.
- [`LICENSE`](LICENSE) — lisensi Apache 2.0 untuk project ini.

## Catatan desain

zzspectra menggunakan beberapa prinsip berikut dalam pengembangan UI:

- **Dark-only** untuk menjaga kenyamanan di lingkungan kerja lighting.
- **Kontras tinggi** agar label, angka, dan status dapat dibaca dengan cepat.
- **Warna aksen bermakna** untuk membedakan status, kontrol, dan perhatian operator.
- **Progressive disclosure** agar kontrol lanjutan tidak mengganggu tugas utama.
- **Touch target yang layak** untuk menjaga usability di tablet dan mobile.
- **Motion yang fungsional**—animasi digunakan untuk feedback, bukan dekorasi berlebihan.

## Kontribusi dan pengembangan lanjutan

Project ini masih dalam tahap eksperimen. Jika ingin mengembangkan lebih lanjut, mulai dari:

1. Baca [`PRD.md`](PRD.md) untuk memahami kebutuhan produk.
2. Baca [`DESIGN.md`](DESIGN.md) sebelum mengubah UI.
3. Cek [`PLAN.md`](PLAN.md) untuk milestone dan prioritas.
4. Jalankan `npm run build` sebelum membuat pull request.
5. Pastikan perubahan tidak menambahkan horizontal overflow pada viewport mobile.

## FAQ singkat

### Apakah ini sudah simulator 3D penuh?

Belum. Versi saat ini adalah MVP interaktif dengan fondasi stage dan kontrol lighting. Simulasi 3D/WebGL yang lebih lengkap berada di roadmap.

### Apakah perlu instalasi software lighting khusus?

Tidak. Untuk demo, cukup buka live demo atau jalankan project menggunakan Node.js dan npm.

### Apakah bisa dipakai dari HP?

Bisa dibuka dari mobile. Layout responsif dan kontrol utama sedang diarahkan agar nyaman untuk touch interaction.

### Apakah data disimpan ke server?

Belum. MVP saat ini tidak membutuhkan backend. Persistence lokal dan fitur project state direncanakan pada fase berikutnya.

### Di mana saya bisa melihat versi online?

Buka **[zzdree.github.io/zzspectra](https://zzdree.github.io/zzspectra/)**.

> [!IMPORTANT]
> zzspectra adalah project eksperimental yang masih berkembang. Fitur dan struktur dapat berubah mengikuti hasil evaluasi visual, performa, dan kebutuhan workflow lighting.

<p align="center">
  <sub>Dibuat untuk operator lighting, desainer panggung, kreator visual, dan developer yang suka bereksperimen.</sub>
</p>
