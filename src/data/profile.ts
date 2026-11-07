/**
 * PixelFolio: satu-satunya file yang perlu Anda ubah.
 *
 * Semua teks di bawah adalah ISIAN TEMPLATE. Ganti dengan data asli Anda.
 * Jangan menambahkan angka, klien, atau testimoni yang tidak bisa dibuktikan.
 * Bagian yang dikosongkan (array kosong / string kosong) tidak akan tampil.
 */

export type Project = {
  /** Dipakai sebagai URL: /karya/<slug>/ */
  slug: string;
  title: string;
  /** Satu kalimat: apa yang dibuat dan untuk siapa. */
  summary: string;
  kind: string;
  year: number;
  role: string;
  tools: string[];
  /**
   * Path gambar di /public, misal "/images/proyek-satu.jpg".
   * Kosongkan untuk memakai sampul piksel otomatis (penanda sampai screenshot asli siap).
   */
  cover?: string;
  /** Angka 0 sampai 3, memilih pasangan warna sampul piksel otomatis. */
  tone: 0 | 1 | 2 | 3;
  /** Tautan ke situs live. Kosongkan bila tidak ada. */
  url?: string;
  /** Isi halaman studi kasus. */
  caseStudy: { heading: string; body: string }[];
};

export const profile = {
  name: 'Nama Anda',
  initials: 'NA',
  role: 'desainer & developer web',
  /** Kota atau kawasan saja, tanpa alamat lengkap. */
  city: 'Jakarta',
  /** Path foto di /public, misal "/images/foto.jpg". Kosong = avatar inisial. */
  photo: '',
  /** Kalimat pendek di bawah judul hero, 15 sampai 30 kata. */
  intro:
    'Saya merancang dan membangun situs serta aplikasi web untuk brand kecil dan tim produk, dari riset pertama sampai halaman yang siap rilis.',
  /** Status ketersediaan. Kosongkan bila tidak ingin ditampilkan. */
  availability: 'Menerima proyek baru mulai Januari 2027',
  /** Gunakan alamat asli Anda. Domain .example hanya penanda template. */
  email: 'halo@namaanda.example',
  /** Janji balasan yang benar-benar bisa Anda tepati. Kosongkan bila tidak yakin. */
  replyNote: 'Tulis singkat tentang proyek, tenggat, dan kisaran anggaran Anda.',
  /** Path file CV di /public, misal "/cv.pdf". Kosongkan untuk menyembunyikan tombol. */
  cvFile: '',
  socials: [] as { label: string; url: string }[],
};

export const about = {
  heading: 'Tentang saya',
  paragraphs: [
    'Tulis dua atau tiga kalimat tentang siapa Anda dan pekerjaan seperti apa yang paling Anda kuasai. Sebut bidang atau industri yang sering Anda tangani.',
    'Paragraf kedua bisa menjelaskan cara Anda bekerja dengan klien: seberapa sering Anda melapor, bagaimana keputusan desain diambil, dan apa yang klien terima di akhir proyek.',
  ],
  /** Alat yang benar-benar Anda pakai sehari-hari. */
  tools: [
    { group: 'Desain', items: ['Figma', 'Aseprite', 'Photoshop'] },
    { group: 'Kode', items: ['TypeScript', 'Astro', 'React', 'CSS'] },
    { group: 'Rilis', items: ['Vercel', 'Netlify', 'GitHub Actions'] },
  ],
};

export const workProcess = {
  heading: 'Cara saya mengerjakan proyek',
  lead: 'Setiap proyek melewati empat tahap. Anda melihat hasil kerja di akhir setiap tahap, bukan hanya di akhir proyek.',
  steps: [
    {
      title: 'Memahami masalah',
      body: 'Wawancara singkat dengan Anda dan pengguna, lalu satu dokumen ringkas berisi tujuan, batasan, dan ukuran berhasil.',
    },
    {
      title: 'Menyusun arah visual',
      body: 'Dua atau tiga arah desain dalam bentuk halaman nyata, bukan papan mood. Kita pilih satu dan mempertajamnya.',
    },
    {
      title: 'Membangun halaman',
      body: 'Desain langsung jadi kode. Anda mendapat tautan pratinjau yang diperbarui setiap kali ada kemajuan.',
    },
    {
      title: 'Merilis dan merawat',
      body: 'Uji di ponsel dan desktop, pindah ke domain Anda, lalu serah terima dengan panduan singkat untuk tim.',
    },
  ],
};

const caseStudyTemplate = (title: string) => [
  {
    heading: 'Tantangan',
    body: `Jelaskan masalah yang dihadapi klien sebelum ${title} dibuat. Apa yang tidak berjalan, dan siapa yang terdampak?`,
  },
  {
    heading: 'Pendekatan',
    body: 'Ceritakan keputusan penting yang Anda ambil dan alasannya. Sertakan sketsa, alur, atau screenshot di tahap ini.',
  },
  {
    heading: 'Hasil',
    body: 'Tuliskan apa yang berubah setelah rilis. Gunakan angka hanya bila Anda punya datanya.',
  },
];

export const projects: Project[] = [
  {
    slug: 'proyek-satu',
    title: 'Proyek Satu',
    summary: 'Ringkasan satu kalimat: apa yang Anda buat, untuk siapa, dan masalah apa yang diselesaikan.',
    kind: 'Situs perusahaan',
    year: 2026,
    role: 'Desain dan pengembangan',
    tools: ['Figma', 'Astro'],
    tone: 0,
    caseStudy: caseStudyTemplate('Proyek Satu'),
  },
  {
    slug: 'proyek-dua',
    title: 'Proyek Dua',
    summary: 'Ringkasan satu kalimat tentang proyek kedua.',
    kind: 'Aplikasi web',
    year: 2025,
    role: 'Pengembangan front-end',
    tools: ['React', 'TypeScript'],
    tone: 1,
    caseStudy: caseStudyTemplate('Proyek Dua'),
  },
  {
    slug: 'proyek-tiga',
    title: 'Proyek Tiga',
    summary: 'Ringkasan satu kalimat tentang proyek ketiga.',
    kind: 'Identitas visual',
    year: 2025,
    role: 'Desain',
    tools: ['Figma', 'Aseprite'],
    tone: 2,
    caseStudy: caseStudyTemplate('Proyek Tiga'),
  },
  {
    slug: 'proyek-empat',
    title: 'Proyek Empat',
    summary: 'Ringkasan satu kalimat tentang proyek keempat.',
    kind: 'Toko online',
    year: 2024,
    role: 'Desain dan pengembangan',
    tools: ['Astro', 'CSS'],
    tone: 3,
    caseStudy: caseStudyTemplate('Proyek Empat'),
  },
  {
    slug: 'proyek-lima',
    title: 'Proyek Lima',
    summary: 'Ringkasan satu kalimat tentang proyek kelima.',
    kind: 'Situs acara',
    year: 2023,
    role: 'Pengembangan',
    tools: ['TypeScript', 'Netlify'],
    tone: 1,
    caseStudy: caseStudyTemplate('Proyek Lima'),
  },
];
