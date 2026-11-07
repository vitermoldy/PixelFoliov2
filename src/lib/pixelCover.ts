/**
 * Sampul piksel otomatis untuk proyek yang belum punya screenshot.
 * Dihasilkan saat build sebagai SVG (tanpa JavaScript di browser).
 * Komposisi ditentukan dari slug, jadi setiap proyek punya sampul berbeda tapi stabil.
 */

const PALETTES = [
  { bg: '#f3f0e8', a: '#2b44e0', b: '#e8e4d8', c: '#14130f', d: '#ff5a1f' },
  { bg: '#14130f', a: '#ff5a1f', b: '#2a2823', c: '#f3f0e8', d: '#2b44e0' },
  { bg: '#2b44e0', a: '#f3f0e8', b: '#2238bf', c: '#14130f', d: '#ff5a1f' },
  { bg: '#ff5a1f', a: '#14130f', b: '#f26a35', c: '#f3f0e8', d: '#2b44e0' },
] as const;

const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let t = seed;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export type PixelCover = { w: number; h: number; bg: string; layers: { fill: string; d: string }[] };

export function pixelCover(slug: string, tone: number, w = 40, h = 25): PixelCover {
  const pal = PALETTES[tone % PALETTES.length];
  const rand = rng(hashString(slug));
  const grid: (string | null)[] = new Array(w * h).fill(null);
  const set = (x: number, y: number, c: string) => {
    if (x >= 0 && y >= 0 && x < w && y < h) grid[y * w + x] = c;
  };

  // 1. gradien ber-dither dari bawah, arah miring ditentukan slug
  const tilt = (rand() - 0.5) * 0.9;
  const horizon = 0.35 + rand() * 0.25;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const v = (y / h - horizon + (x / w - 0.5) * tilt) * 2.2;
      const threshold = (BAYER[y % 4][x % 4] + 0.5) / 16;
      if (v > threshold) set(x, y, pal.a);
      else if (v > threshold - 0.35) set(x, y, pal.b);
    }
  }

  // 2. satu lingkaran besar, dibulatkan ke grid
  const cx = Math.round(w * (0.2 + rand() * 0.6));
  const cy = Math.round(h * (0.25 + rand() * 0.3));
  const r = 4 + Math.round(rand() * 4);
  for (let y = -r; y <= r; y++) {
    for (let x = -r; x <= r; x++) {
      if (x * x + y * y <= r * r + r * 0.6) set(cx + x, cy + y, pal.d);
    }
  }

  // 3. dua sampai tiga blok seperti potongan antarmuka
  const blocks = 2 + Math.round(rand());
  for (let i = 0; i < blocks; i++) {
    const bw = 6 + Math.round(rand() * 9);
    const bh = 4 + Math.round(rand() * 5);
    const bx = Math.round(rand() * (w - bw - 2)) + 1;
    const by = Math.round(rand() * (h - bh - 2)) + 1;
    for (let y = 0; y < bh; y++) {
      for (let x = 0; x < bw; x++) {
        const edge = x === 0 || y === 0 || x === bw - 1 || y === bh - 1;
        if (edge) set(bx + x, by + y, pal.c);
        else if (y === 2 && x > 1 && x < bw - 2 - (i % 3)) set(bx + x, by + y, pal.c);
        else set(bx + x, by + y, pal.bg);
      }
    }
  }

  // gabungkan piksel per warna menjadi satu path, per baris
  const byColor = new Map<string, string[]>();
  for (let y = 0; y < h; y++) {
    let x = 0;
    while (x < w) {
      const c = grid[y * w + x];
      if (!c) {
        x++;
        continue;
      }
      let run = 1;
      while (x + run < w && grid[y * w + x + run] === c) run++;
      if (!byColor.has(c)) byColor.set(c, []);
      byColor.get(c)!.push(`M${x} ${y}h${run}v1h-${run}z`);
      x += run;
    }
  }

  return {
    w,
    h,
    bg: pal.bg,
    layers: [...byColor.entries()].map(([fill, parts]) => ({ fill, d: parts.join('') })),
  };
}
