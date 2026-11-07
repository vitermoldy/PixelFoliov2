// @ts-check
import { defineConfig } from 'astro/config';

// Ganti `site` dengan domain Anda sebelum deploy (dipakai untuk URL kanonis).
export default defineConfig({
  site: 'https://namaanda.example',
  output: 'static',
  build: { format: 'directory' },
});
