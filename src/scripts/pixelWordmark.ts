/**
 * Nama di footer, digambar dengan bitmap font 5x7 milik template ini.
 * Blok terdorong menjauh dari kursor lalu kembali ke tempatnya dengan pegas.
 * Loop berhenti sendiri saat semua blok sudah diam.
 */

const G: Record<string, string> = {
  A: '.###.|#...#|#...#|#####|#...#|#...#|#...#',
  B: '####.|#...#|#...#|####.|#...#|#...#|####.',
  C: '.###.|#...#|#....|#....|#....|#...#|.###.',
  D: '####.|#...#|#...#|#...#|#...#|#...#|####.',
  E: '#####|#....|#....|####.|#....|#....|#####',
  F: '#####|#....|#....|####.|#....|#....|#....',
  G: '.###.|#...#|#....|#.###|#...#|#...#|.####',
  H: '#...#|#...#|#...#|#####|#...#|#...#|#...#',
  I: '###|.#.|.#.|.#.|.#.|.#.|###',
  J: '..###|...#.|...#.|...#.|#..#.|#..#.|.##..',
  K: '#...#|#..#.|#.#..|##...|#.#..|#..#.|#...#',
  L: '#....|#....|#....|#....|#....|#....|#####',
  M: '#...#|##.##|#.#.#|#.#.#|#...#|#...#|#...#',
  N: '#...#|#...#|##..#|#.#.#|#..##|#...#|#...#',
  O: '.###.|#...#|#...#|#...#|#...#|#...#|.###.',
  P: '####.|#...#|#...#|####.|#....|#....|#....',
  Q: '.###.|#...#|#...#|#...#|#.#.#|#..#.|.##.#',
  R: '####.|#...#|#...#|####.|#.#..|#..#.|#...#',
  S: '.####|#....|#....|.###.|....#|....#|####.',
  T: '#####|..#..|..#..|..#..|..#..|..#..|..#..',
  U: '#...#|#...#|#...#|#...#|#...#|#...#|.###.',
  V: '#...#|#...#|#...#|#...#|#...#|.#.#.|..#..',
  W: '#...#|#...#|#...#|#.#.#|#.#.#|#.#.#|.#.#.',
  X: '#...#|#...#|.#.#.|..#..|.#.#.|#...#|#...#',
  Y: '#...#|#...#|.#.#.|..#..|..#..|..#..|..#..',
  Z: '#####|....#|...#.|..#..|.#...|#....|#####',
  '0': '.###.|#...#|#..##|#.#.#|##..#|#...#|.###.',
  '1': '.#.|##.|.#.|.#.|.#.|.#.|###',
  '2': '.###.|#...#|....#|...#.|..#..|.#...|#####',
  '3': '####.|....#|....#|.###.|....#|....#|####.',
  '4': '...#.|..##.|.#.#.|#..#.|#####|...#.|...#.',
  '5': '#####|#....|####.|....#|....#|#...#|.###.',
  '6': '.###.|#....|#....|####.|#...#|#...#|.###.',
  '7': '#####|....#|...#.|..#..|.#...|.#...|.#...',
  '8': '.###.|#...#|#...#|.###.|#...#|#...#|.###.',
  '9': '.###.|#...#|#...#|.####|....#|....#|.###.',
  '.': '..|..|..|..|..|##|##',
  ',': '..|..|..|..|..|.#|#.',
  '-': '....|....|....|####|....|....|....',
  "'": '#|#|.|.|.|.|.',
  '&': '.##..|#..#.|#.#..|.#...|#.#.#|#..#.|.##.#',
  ' ': '...|...|...|...|...|...|...',
};

type Block = { hx: number; hy: number; x: number; y: number; vx: number; vy: number };

function glyph(ch: string) {
  return (G[ch] ?? G[' ']).split('|');
}

function lineWidth(line: string) {
  let w = 0;
  for (const ch of line) w += glyph(ch)[0].length + 1;
  return Math.max(0, w - 1);
}

/** Pecah nama menjadi satu atau dua baris, pilih yang paling seimbang. */
function layout(word: string, cols: number) {
  if (lineWidth(word) <= cols || !word.includes(' ')) return [word];
  const parts = word.split(' ');
  let best = [word];
  let bestW = Infinity;
  for (let i = 1; i < parts.length; i++) {
    const lines = [parts.slice(0, i).join(' '), parts.slice(i).join(' ')];
    const w = Math.max(...lines.map(lineWidth));
    if (w < bestW) {
      bestW = w;
      best = lines;
    }
  }
  return best;
}

export function mountPixelWordmark(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>('[data-wordmark]');
  const text = root.querySelector<HTMLElement>('[data-wordmark-text]');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx || !text) return;

  const word = (text.textContent || '')
    .trim()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase();
  const css = getComputedStyle(document.documentElement);
  const ink = css.getPropertyValue('--ink').trim() || '#14130f';
  const accent = css.getPropertyValue('--accent').trim() || '#ff5a1f';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let blocks: Block[] = [];
  let cell = 10;
  let W = 0;
  let H = 0;
  let mx = -9999;
  let my = -9999;
  let raf = 0;

  function build() {
    const width = root.clientWidth;
    // satu baris bila blok masih cukup besar, selain itu dua baris
    let lines = [word];
    cell = Math.floor(width / Math.max(1, lineWidth(word)));
    if (cell < 7) {
      lines = layout(word, 0);
      lines = lines.length > 1 ? lines : [word];
      cell = Math.floor(width / Math.max(...lines.map(lineWidth)));
    }
    cell = Math.max(3, Math.min(32, cell));

    blocks = [];
    lines.forEach((line, li) => {
      let cx = 0;
      const top = li * 9;
      for (const ch of line) {
        const rows = glyph(ch);
        rows.forEach((row, ry) => {
          for (let rx = 0; rx < row.length; rx++) {
            if (row[rx] !== '#') continue;
            const hx = (cx + rx) * cell;
            const hy = (top + ry) * cell;
            blocks.push({ hx, hy, x: hx, y: hy, vx: 0, vy: 0 });
          }
        });
        cx += rows[0].length + 1;
      }
    });

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = width;
    H = (lines.length * 9 - 2) * cell;
    canvas!.width = Math.round(W * dpr);
    canvas!.height = Math.round(H * dpr);
    canvas!.style.width = `${W}px`;
    canvas!.style.height = `${H}px`;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    root.classList.add('has-canvas');
    render(false);
  }

  function render(step: boolean) {
    let moving = false;
    ctx!.clearRect(0, 0, W, H);
    const R = cell * 6;
    for (const b of blocks) {
      if (step) {
        const dx = b.x + cell / 2 - mx;
        const dy = b.y + cell / 2 - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < R * R && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const f = ((R - d) / R) * cell * 0.22;
          b.vx += (dx / d) * f;
          b.vy += (dy / d) * f;
        }
        b.vx += (b.hx - b.x) * 0.08;
        b.vy += (b.hy - b.y) * 0.08;
        b.vx *= 0.78;
        b.vy *= 0.78;
        b.x += b.vx;
        b.y += b.vy;
        if (Math.abs(b.vx) + Math.abs(b.vy) > 0.05 || Math.abs(b.x - b.hx) + Math.abs(b.y - b.hy) > 0.5) moving = true;
        else {
          b.x = b.hx;
          b.y = b.hy;
        }
      }
      const displaced = Math.abs(b.x - b.hx) + Math.abs(b.y - b.hy) > cell * 0.5;
      ctx!.fillStyle = displaced ? accent : ink;
      ctx!.fillRect(Math.round(b.x), Math.round(b.y), cell, cell);
    }
    return moving;
  }

  function loop() {
    const moving = render(true);
    raf = moving || mx > -9999 ? requestAnimationFrame(loop) : 0;
  }

  if (!reduced) {
    canvas.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    canvas.addEventListener('pointerleave', () => {
      mx = -9999;
      my = -9999;
      if (!raf) raf = requestAnimationFrame(loop);
    });
  }

  build();
  let lastW = root.clientWidth;
  new ResizeObserver(() => {
    if (Math.abs(root.clientWidth - lastW) < 1) return;
    lastW = root.clientWidth;
    build();
  }).observe(root);
}
