# PixelFolio: arah desain

Dial: ENERGY 3 / RHYTHM 3 / MOTION 2

Design Read: portofolio desainer dan developer web untuk calon klien, gaya editorial kertas dan tinta dengan motif piksel.

Referensi rasa: craft.wild.as (grid piksel, judul besar, label kecil, gerak bertahap). Yang diambil hanya arah; kode, teks, efek kanvas, dan permainan di footer tidak disalin.

## Identitas

- **Motif:** piksel persegi. Muncul di papan gambar hero, sampul proyek, bar progres proses, sudut tombol yang berundak, garis bawah tautan yang putus-putus, dan nama di footer.
- **Satu aksen:** oranye `#ff5a1f`, hanya sebagai isian (titik status, piksel, bar progres), tidak pernah sebagai warna teks.

## Alasan setiap keputusan (antislop R-31)

| Keputusan | Alasan |
|---|---|
| Kertas `#f3f0e8` + tinta `#14130f` | Kesan cetak yang hangat, pembeda dari putih bersih bawaan template; kontras 16,3:1. |
| Kobalt `#2b44e0` sebagai warna kedua | Dipakai untuk piksel dan hover tombol agar oranye tetap langka; kontras teks putih di atasnya 7:1. |
| Tema terang tanpa toggle gelap | Identitasnya kertas dan tinta; panel gelap (proyek unggulan, proses) dipakai sebagai jeda ritme, bukan mode. |
| Schibsted Grotesk | Grotesk editorial dengan karakter tegas di ukuran besar, bukan Inter/Geist bawaan AI. |
| Tiny5 untuk label kecil | Font piksel yang angka dan huruf kecilnya tetap terbaca di 15px (Pixelify Sans diuji dan ditolak: angka 5 terbaca seperti S). Huruf biasa, bukan kapital berjarak lebar. |
| Bitmap 5x7 buatan sendiri di footer | Tajam di setiap ukuran dan tidak bergantung pada pemuatan font. |
| Grid 8px | Semua jarak kelipatan satu "piksel besar", agar motif terasa sampai ke tata letak. |
| Proyek unggulan + indeks baris | Hierarki jelas: satu proyek besar, sisanya daftar yang cepat dipindai. Bukan grid kartu seragam (R-14). |
| Panel pratinjau di arsip | Memberi gambar pada bagian yang tadinya hanya teks; berganti saat hover dan saat fokus keyboard. |
| Empat tahap proses dengan bar progres | Bar menunjukkan posisi tahap (1/4 sampai 4/4), jadi berfungsi, bukan hiasan. Empat, bukan pola tiga langkah. |
| Panah piksel di baris arsip | Satu-satunya panah di situs: menandai baris sebagai tautan ke halaman studi kasus. |
| Sudut berundak pada tombol | Satu bentuk tombol untuk seluruh situs, menyambung motif piksel tanpa radius pil. |
| Radius 16px hanya pada panel gelap dan gambar | Membedakan bidang besar dari kontrol kecil yang bersudut tegas. |

## Gerak (MOTION 2) dan tujuannya

| Gerak | Tujuan |
|---|---|
| Judul hero naik dalam 5 langkah (`steps()`) | Satu momen pembuka yang membawa motif piksel ke tipografi. Mati di `prefers-reduced-motion`. |
| Pita piksel hero tersusun 8 langkah saat dibuka | Memperkenalkan papan gambar sekali saja, lalu diam. |
| Kursor menggambar piksel yang memudar | Mengundang interaksi; hanya bergerak saat pengunjung bergerak, berhenti sendiri setelah 3,2 detik. |
| Pratinjau arsip membuka dalam 5 langkah | Menghubungkan baris yang di-hover dengan gambarnya. |
| Nama di footer terdorong kursor | Penutup yang bisa dimainkan; loop berhenti saat semua blok kembali. |
| Hover: tombol naik 1px, kartu foto zoom 1.03, garis bawah tergambar | Umpan balik bahwa elemen bisa diklik. |

Tidak ada animasi saat scroll, tidak ada loop yang berjalan sendiri lebih dari 5 detik.
