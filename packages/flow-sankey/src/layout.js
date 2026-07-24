/* computeLayout — pure geometry. No React, no DOM.
   Takes the adapter output (+ optional drill context) and returns
   positioned bands, ribbon paths, and the ghost scope band geometry.
   Kept renderer-agnostic so it can be ported to vanilla DOM, canvas,
   or server-side SVG without touching the math. */

export function computeLayout(data, context, opts = {}) {
  const viewW = opts.viewW ?? 920;
  const padX = 52;
  const nodeH = 46;
  const ghostH = 34;
  const expandH = 138;
  const ribbonH = 200;
  const headerH = 74;
  const gapTotal = 24;
  const total = data.root.value;
  const usableW = viewW - padX * 2;
  const k = (usableW - gapTotal) / total;

  let y = 84;
  let ghost = null;
  if (context) {
    const sliceW = Math.max(6, (context.subsetValue / context.parentValue) * usableW);
    ghost = { y, h: ghostH, x: padX, w: usableW, sliceW };
    y += ghostH + expandH;
    const ym = (ghost.y + ghostH + y) / 2;
    ghost.expandPath = [
      `M ${padX} ${ghost.y + ghostH}`,
      `C ${padX} ${ym} ${padX} ${ym} ${padX} ${y}`,
      `L ${padX + usableW} ${y}`,
      `C ${padX + usableW} ${ym} ${padX + sliceW} ${ym} ${padX + sliceW} ${ghost.y + ghostH}`,
      "Z",
    ].join(" ");
  }

  const bands = [];
  bands.push({
    dimension: "Baseline",
    y,
    nodes: [{ id: "__root__", label: data.root.label, value: total, x: padX, w: usableW, colorIdx: -1 }],
  });
  y += nodeH;

  data.levels.forEach((level, li) => {
    y += ribbonH + headerH;
    const n = level.nodes.length;
    const gap = n > 1 ? gapTotal / (n - 1) : gapTotal;
    let x = padX;
    const nodes = level.nodes.map((nd, i) => {
      const w = n === 1 ? usableW : nd.value * k;
      const placed = { ...nd, x, w, colorIdx: i, levelIdx: li };
      x += w + (n === 1 ? 0 : gap);
      return placed;
    });
    bands.push({ dimension: level.dimension, y, nodes });
    y += nodeH;
  });

  const totalH = y + 90;

  const ribbons = [];
  for (let b = 1; b < bands.length; b++) {
    const src = bands[b - 1];
    const tgt = bands[b];
    const srcById = Object.fromEntries(src.nodes.map((n) => [n.id, n]));
    const tgtById = Object.fromEntries(tgt.nodes.map((n) => [n.id, n]));
    const srcOrder = Object.fromEntries(src.nodes.map((n, i) => [n.id, i]));
    const tgtOrder = Object.fromEntries(tgt.nodes.map((n, i) => [n.id, i]));

    const flows =
      b === 1 && !data.levels[0].flows
        ? tgt.nodes.map((n) => ({ from: "__root__", to: n.id, value: n.value }))
        : data.levels[b - 1].flows;

    const srcOff = {};
    const tgtOff = {};
    [...flows]
      .sort((a, z) => srcOrder[a.from] - srcOrder[z.from] || tgtOrder[a.to] - tgtOrder[z.to])
      .forEach((f) => {
        const n = srcById[f.from];
        const w = (f.value / n.value) * n.w;
        f._sx = n.x + (srcOff[f.from] ?? 0);
        f._sw = w;
        srcOff[f.from] = (srcOff[f.from] ?? 0) + w;
      });
    [...flows]
      .sort((a, z) => tgtOrder[a.to] - tgtOrder[z.to] || srcOrder[a.from] - srcOrder[z.from])
      .forEach((f) => {
        const n = tgtById[f.to];
        const w = (f.value / n.value) * n.w;
        f._tx = n.x + (tgtOff[f.to] ?? 0);
        f._tw = w;
        tgtOff[f.to] = (tgtOff[f.to] ?? 0) + w;
      });

    flows.forEach((f) => {
      const ys = src.y + nodeH;
      const yt = tgt.y;
      const ym = (ys + yt) / 2;
      ribbons.push({
        ...f,
        bandIdx: b,
        srcNode: srcById[f.from],
        tgtNode: tgtById[f.to],
        path: [
          `M ${f._sx} ${ys}`,
          `C ${f._sx} ${ym} ${f._tx} ${ym} ${f._tx} ${yt}`,
          `L ${f._tx + f._tw} ${yt}`,
          `C ${f._tx + f._tw} ${ym} ${f._sx + f._sw} ${ym} ${f._sx + f._sw} ${ys}`,
          "Z",
        ].join(" "),
      });
    });
  }

  return { bands, ribbons, ghost, viewW, totalH, nodeH, padX };
}
