/**
 * Papan piksel di hero.
 * - Pita ber-dither di bawah hero tersusun sekali saat halaman dibuka (baris demi baris).
 * - Kursor (mouse/pen) menggambar piksel; ketukan jari menaruh satu kuas tanpa menghalangi scroll.
 * - Piksel memudar dalam tiga langkah, kecuali mode "gambar tetap" aktif.
 * - Loop animasi hanya hidup selama ada yang berubah; diam total saat tidak ada interaksi.
 */

const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

const FADE_MS = 3200;
const INTRO_MS = 900;

export function mountPixelBoard(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>('[data-board]');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return;

  const css = getComputedStyle(document.documentElement);
  const colours = {
    ink: css.getPropertyValue('--ink').trim() || '#14130f',
    cobalt: css.getPropertyValue('--cobalt').trim() || '#2b44e0',
    accent: css.getPropertyValue('--accent').trim() || '#ff5a1f',
    paper: css.getPropertyValue('--paper').trim() || '#f3f0e8',
  };
  const palette = [colours.ink, colours.cobalt, colours.accent];

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cell = 12;
  let cols = 0;
  let rows = 0;
  let base = new Uint8Array(0); // 0 kosong, 1..3 indeks palet + 1
  let paint = new Uint8Array(0);
  let life = new Float32Array(0);
  let brush = 2; // indeks palet aktif (aksen)
  let keep = false;
  let introStart = reduced ? -Infinity : performance.now();
  let raf = 0;
  let last = performance.now();
  let lastW = 0;
  let px = -1;
  let py = -1;

  function size() {
    const rect = root.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cell = rect.width < 640 ? 10 : 12;
    cols = Math.ceil(rect.width / cell);
    rows = Math.ceil(rect.height / cell);
    canvas!.width = Math.round(cols * cell * dpr);
    canvas!.height = Math.round(rows * cell * dpr);
    canvas!.style.width = `${cols * cell}px`;
    canvas!.style.height = `${rows * cell}px`;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    base = new Uint8Array(cols * rows);
    paint = new Uint8Array(cols * rows);
    life = new Float32Array(cols * rows);
    buildBand();
  }

  // pita ber-dither: tinta di dasar, kobalt di tengah, aksen jarang di puncak
  function buildBand() {
    const band = Math.max(8, Math.round(rows * 0.34));
    const top = rows - band;
    for (let r = top; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const wave = Math.sin(c * 0.11) * 0.08 + Math.sin(c * 0.037 + 1.7) * 0.12;
        const v = (r - top) / band + wave;
        const t = (BAYER[r % 4][c % 4] + 0.5) / 16;
        let k = 0;
        if (v > 0.62 + t * 0.38) k = 1;
        else if (v > 0.22 + t * 0.4) k = 2;
        else if (v > 0.1 + t * 0.9 && (c * 7 + r * 3) % 5 === 0) k = 3;
        base[r * cols + c] = k;
      }
    }
  }

  function stamp(x: number, y: number) {
    const c0 = Math.floor(x / cell);
    const r0 = Math.floor(y / cell);
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (Math.abs(dr) + Math.abs(dc) > 1) continue; // kuas berbentuk plus
        const c = c0 + dc;
        const r = r0 + dr;
        if (c < 0 || r < 0 || c >= cols || r >= rows) continue;
        const i = r * cols + c;
        paint[i] = brush + 1;
        life[i] = 1;
      }
    }
    wake();
  }

  function stroke(x: number, y: number) {
    if (px < 0) {
      px = x;
      py = y;
    }
    const dx = x - px;
    const dy = y - py;
    const steps = Math.max(1, Math.min(64, Math.round(Math.hypot(dx, dy) / (cell * 0.75))));
    for (let s = 1; s <= steps; s++) stamp(px + (dx * s) / steps, py + (dy * s) / steps);
    px = x;
    py = y;
  }

  function draw(now: number) {
    const dt = Math.min(64, now - last);
    last = now;
    let busy = false;

    // pita: baris muncul dari bawah ke atas dalam langkah tegas
    const introP = Math.min(1, (now - introStart) / INTRO_MS);
    const stepped = Math.ceil(introP * 8) / 8;
    const visibleFrom = rows - Math.round(rows * 0.34 * stepped);
    if (introP < 1) busy = true;

    ctx!.clearRect(0, 0, cols * cell, rows * cell);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        let colour = '';
        let alpha = 1;
        if (paint[i] && life[i] > 0) {
          if (!keep) {
            life[i] -= dt / FADE_MS;
            if (life[i] <= 0) {
              life[i] = 0;
              paint[i] = 0;
            }
          }
          if (paint[i]) {
            colour = palette[paint[i] - 1];
            alpha = life[i] > 0.66 ? 1 : life[i] > 0.33 ? 0.6 : 0.28;
            if (!keep) busy = true;
          }
        }
        if (!colour && base[i] && r >= visibleFrom) colour = palette[base[i] - 1];
        if (!colour) continue;
        ctx!.globalAlpha = alpha;
        ctx!.fillStyle = colour;
        ctx!.fillRect(c * cell, r * cell, cell, cell);
      }
    }
    ctx!.globalAlpha = 1;

    raf = busy ? requestAnimationFrame(draw) : 0;
  }

  function wake() {
    if (!raf) {
      last = performance.now();
      raf = requestAnimationFrame(draw);
    }
  }

  function local(e: PointerEvent) {
    const rect = canvas!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  root.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    const p = local(e);
    stroke(p.x, p.y);
  });
  root.addEventListener('pointerleave', () => {
    px = -1;
    py = -1;
  });
  root.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'touch') return;
    if ((e.target as HTMLElement).closest('a, button')) return;
    const p = local(e);
    px = -1;
    stamp(p.x, p.y);
  });

  // toolbar
  const swatches = root.querySelectorAll<HTMLButtonElement>('[data-swatch]');
  swatches.forEach((btn) => {
    btn.addEventListener('click', () => {
      brush = Number(btn.dataset.swatch);
      swatches.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    });
  });

  const keepBtn = root.querySelector<HTMLButtonElement>('[data-keep]');
  keepBtn?.addEventListener('click', () => {
    keep = !keep;
    keepBtn.setAttribute('aria-pressed', String(keep));
    if (!keep) wake();
  });

  const status = root.querySelector<HTMLElement>('[data-board-status]');
  const say = (msg: string) => {
    if (status) status.textContent = msg;
  };

  root.querySelector('[data-clear]')?.addEventListener('click', () => {
    paint.fill(0);
    life.fill(0);
    wake();
    say('Gambar dibersihkan.');
  });

  root.querySelector('[data-save]')?.addEventListener('click', () => {
    const out = document.createElement('canvas');
    out.width = cols * cell;
    out.height = rows * cell;
    const o = out.getContext('2d');
    if (!o) {
      say('Browser ini tidak bisa menyimpan gambar.');
      return;
    }
    o.fillStyle = colours.paper;
    o.fillRect(0, 0, out.width, out.height);
    o.imageSmoothingEnabled = false;
    o.drawImage(canvas!, 0, 0, out.width, out.height);
    out.toBlob((blob) => {
      if (!blob) {
        say('Gambar gagal disimpan. Coba lagi.');
        return;
      }
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'pixelfolio.png';
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      say('Gambar tersimpan sebagai pixelfolio.png.');
    }, 'image/png');
  });

  size();
  lastW = root.getBoundingClientRect().width;
  wake();
  new ResizeObserver(() => {
    const w = root.getBoundingClientRect().width;
    if (Math.abs(w - lastW) < 1) return; // abaikan perubahan tinggi bilah alamat ponsel
    lastW = w;
    introStart = -Infinity;
    size();
    wake();
  }).observe(root);
}
