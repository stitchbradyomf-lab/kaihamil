import React, { useEffect, useMemo, useRef, useState } from "react";
import { computeLayout } from "./layout.js";
import { defaultTheme } from "./theme.js";

/* VerticalSankey — the reusable renderer.
   Presentational + interaction only; owns no filter or order state.
   The host app owns rows, the filter stack, and dimension order, and
   re-runs flowsToSankey on every drill/zoom/reorder (see examples/).

   Props:
   - data            adapter output (required)
   - context         { parentLabel, parentValue, subsetValue, grandTotal,
                       grandLabel, sliceColor } | null — renders the ghost
                       scope band above the root when filtered
   - breadcrumb      [{ label, onClick|null }] — filter lineage chips
   - dimensionLadder [{ field, label }] — current active dimension order
   - onApplyOrder    (fields: string[]) => void — ladder accordion commit
   - onNodeClick     (node) => void — drill trigger; omit to disable drilling
   - onZoomOut       () => void — ghost band click
   - title, subtitle, formatValue, theme
*/
export function VerticalSankey({
  data,
  context = null,
  breadcrumb = [],
  dimensionLadder = [],
  onApplyOrder,
  onNodeClick,
  onZoomOut,
  theme = defaultTheme,
  title = "Flow Ledger",
  subtitle,
  formatValue = (v) => v.toLocaleString(),
}) {
  const layout = useMemo(() => computeLayout(data, context), [data, context]);
  const { bands, ribbons, ghost, viewW, totalH, nodeH, padX } = layout;

  const containerRef = useRef(null);
  const firstLoad = useRef(true);
  const dataRef = useRef(null);
  const [revealed, setRevealed] = useState(() => new Set([0]));
  const [hover, setHover] = useState(null);
  const [tip, setTip] = useState(null);
  const [ladderOpen, setLadderOpen] = useState(false);
  const [draft, setDraft] = useState([]);

  const openLadder = () => {
    setDraft(dimensionLadder);
    setLadderOpen(true);
  };
  const moveDraft = (i, dir) =>
    setDraft((d) => {
      const j = i + dir;
      if (j < 0 || j >= d.length) return d;
      const next = [...d];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  const draftDirty = draft.map((d) => d.field).join() !== dimensionLadder.map((d) => d.field).join();

  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href =
      "https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@300;500;700;900&family=IBM+Plex+Mono:wght@400;600&display=swap";
    document.head.appendChild(l);
    return () => document.head.removeChild(l);
  }, []);

  // scroll reveal on first load only; any drill/zoom re-render shows the full graph immediately
  useEffect(() => {
    if (dataRef.current && dataRef.current !== data) firstLoad.current = false;
    dataRef.current = data;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce || !firstLoad.current) {
      setRevealed(new Set(bands.map((_, i) => i)));
      return;
    }
    let raf = null;
    const check = () => {
      raf = null;
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scale = rect.width / viewW;
      const trigger = window.innerHeight * 0.88;
      setRevealed((prev) => {
        let changed = false;
        const next = new Set(prev);
        bands.forEach((band, i) => {
          if (!next.has(i) && rect.top + band.y * scale < trigger) {
            next.add(i);
            changed = true;
          }
        });
        if (next.size === bands.length) firstLoad.current = false;
        return changed ? next : prev;
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    check();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [data, bands, viewW]);

  const nodeColor = (n) =>
    n.unmapped ? theme.unmapped : n.colorIdx === -1 ? theme.ink : theme.palette[n.colorIdx % theme.palette.length];

  const isDim = (kind, key, ids) => {
    if (!hover) return false;
    if (hover.type === "node")
      return kind === "ribbon"
        ? !(ids.from === hover.key || ids.to === hover.key)
        : key !== hover.key && !hover.linked.has(key);
    if (hover.type === "ribbon")
      return kind === "ribbon" ? key !== hover.key : key !== hover.ids.from && key !== hover.ids.to;
    return false;
  };

  const showTip = (e, text) => {
    const r = containerRef.current.getBoundingClientRect();
    setTip({ x: e.clientX - r.left, y: e.clientY - r.top, text });
  };
  const clearHover = () => {
    setHover(null);
    setTip(null);
  };

  const pct = (v) => `${((v / data.root.value) * 100).toFixed(1)}%`;
  const pctOf = (v, of) => `${((v / of) * 100).toFixed(1)}%`;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        color: theme.ink,
        fontFamily: "'Libre Franklin', system-ui, sans-serif",
        padding: "0 0 96px",
      }}
    >
      <header style={{ maxWidth: 920, margin: "0 auto", padding: "56px 24px 8px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            borderBottom: `2px solid ${theme.ink}`,
            paddingBottom: 14,
            gap: 16,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontWeight: 900,
              fontSize: "clamp(26px, 5vw, 40px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
            }}
          >
            {title}
          </h1>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: theme.inkSoft }}>
            unit&nbsp;=&nbsp;{data.unit}
          </span>
        </div>

        {/* breadcrumb */}
        {breadcrumb.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, padding: "12px 0 0" }}>
            {breadcrumb.map((c, i) => {
              const last = i === breadcrumb.length - 1;
              return (
                <React.Fragment key={i}>
                  {i > 0 && <span style={{ color: theme.inkSoft, fontSize: 13 }}>›</span>}
                  <button
                    onClick={c.onClick ?? undefined}
                    disabled={!c.onClick}
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 12.5,
                      padding: "4px 10px",
                      borderRadius: 999,
                      border: `1px solid ${last ? theme.ink : theme.rule}`,
                      background: last ? theme.ink : "transparent",
                      color: last ? "#fff" : theme.inkSoft,
                      cursor: c.onClick ? "pointer" : "default",
                    }}
                  >
                    {c.label}
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* dimension ladder — collapsed summary; expands to a pinned editor */}
        {dimensionLadder.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, padding: "10px 0 0" }}>
            <span
              style={{
                fontSize: 11,
                letterSpacing: "0.14em",
                fontWeight: 700,
                color: theme.inkSoft,
                textTransform: "uppercase",
              }}
            >
              Ladder
            </span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, color: theme.ink }}>
              {dimensionLadder.map((d) => d.label).join(" → ")}
            </span>
            {dimensionLadder.length > 1 && onApplyOrder && (
              <button
                onClick={openLadder}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 12,
                  padding: "4px 12px",
                  borderRadius: 999,
                  border: `1px solid ${theme.ink}`,
                  background: "transparent",
                  color: theme.ink,
                  cursor: "pointer",
                }}
              >
                Reorder ▾
              </button>
            )}
          </div>
        )}

        {/* pinned ladder editor — stays with you until Apply or Cancel */}
        {ladderOpen && (
          <div
            style={{
              position: "fixed",
              top: 10,
              left: "50%",
              transform: "translateX(-50%)",
              width: "min(92vw, 520px)",
              zIndex: 50,
              background: "#FFFFFF",
              border: `1.5px solid ${theme.ink}`,
              borderRadius: 12,
              boxShadow: "0 12px 36px rgba(23,38,44,0.22)",
              padding: 16,
              fontFamily: "'Libre Franklin', system-ui, sans-serif",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
              <span style={{ fontSize: 12, letterSpacing: "0.14em", fontWeight: 700, textTransform: "uppercase" }}>
                Reorder ladder
              </span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: theme.inkSoft }}>
                {draftDirty ? "pending — not applied" : "no changes"}
              </span>
            </div>

            {draft.map((d, i) => (
              <div
                key={d.field}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 10px",
                  marginBottom: 6,
                  borderRadius: 8,
                  border: `1px solid ${theme.rule}`,
                  background: theme.bg,
                }}
              >
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: theme.inkSoft, width: 16 }}>
                  {i + 1}
                </span>
                <span style={{ flex: 1, fontWeight: 700, fontSize: 14 }}>{d.label}</span>
                <button
                  onClick={() => moveDraft(i, -1)}
                  disabled={i === 0}
                  aria-label={`Move ${d.label} up`}
                  style={{
                    width: 42,
                    height: 38,
                    borderRadius: 8,
                    border: `1px solid ${theme.rule}`,
                    background: "#FFF",
                    fontSize: 16,
                    cursor: i === 0 ? "default" : "pointer",
                    opacity: i === 0 ? 0.3 : 1,
                    color: theme.ink,
                  }}
                >
                  ▲
                </button>
                <button
                  onClick={() => moveDraft(i, 1)}
                  disabled={i === draft.length - 1}
                  aria-label={`Move ${d.label} down`}
                  style={{
                    width: 42,
                    height: 38,
                    borderRadius: 8,
                    border: `1px solid ${theme.rule}`,
                    background: "#FFF",
                    fontSize: 16,
                    cursor: i === draft.length - 1 ? "default" : "pointer",
                    opacity: i === draft.length - 1 ? 0.3 : 1,
                    color: theme.ink,
                  }}
                >
                  ▼
                </button>
              </div>
            ))}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
              <button
                onClick={() => setLadderOpen(false)}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 13,
                  padding: "9px 16px",
                  borderRadius: 8,
                  border: `1px solid ${theme.rule}`,
                  background: "transparent",
                  color: theme.inkSoft,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (draftDirty) onApplyOrder?.(draft.map((d) => d.field));
                  setLadderOpen(false);
                }}
                disabled={!draftDirty}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 13,
                  padding: "9px 18px",
                  borderRadius: 8,
                  border: `1.5px solid ${theme.ink}`,
                  background: draftDirty ? theme.ink : "transparent",
                  color: draftDirty ? "#FFF" : theme.inkSoft,
                  cursor: draftDirty ? "pointer" : "default",
                  opacity: draftDirty ? 1 : 0.5,
                }}
              >
                Apply order
              </button>
            </div>
          </div>
        )}

        {subtitle && (
          <p style={{ maxWidth: 640, fontWeight: 300, fontSize: 15.5, lineHeight: 1.55, color: theme.inkSoft }}>
            {subtitle}
          </p>
        )}
      </header>

      <div ref={containerRef} style={{ maxWidth: 920, margin: "0 auto", position: "relative" }}>
        <svg viewBox={`0 0 ${viewW} ${totalH}`} style={{ width: "100%", height: "auto", display: "block" }}>
          <defs>
            <pattern id="hatch" width="7" height="7" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
              <rect width="7" height="7" fill={theme.unmapped} opacity="0.35" />
              <line x1="0" y1="0" x2="0" y2="7" stroke={theme.unmapped} strokeWidth="2.5" />
            </pattern>
          </defs>

          {/* ghost scope level (when filtered) */}
          {ghost && context && (
            <g
              style={{ cursor: "pointer" }}
              onClick={onZoomOut}
              onMouseEnter={(e) => showTip(e, `Zoom out to ${context.parentLabel} · ${formatValue(context.parentValue)}`)}
              onMouseMove={(e) => showTip(e, `Zoom out to ${context.parentLabel} · ${formatValue(context.parentValue)}`)}
              onMouseLeave={clearHover}
            >
              <text
                x={ghost.x}
                y={ghost.y - 12}
                style={{
                  fontSize: 12,
                  letterSpacing: "0.14em",
                  fontWeight: 700,
                  fill: theme.inkSoft,
                  textTransform: "uppercase",
                }}
              >
                Scope — {context.parentLabel} · click to zoom out ↑
              </text>
              <rect
                x={ghost.x}
                y={ghost.y}
                width={ghost.w}
                height={ghost.h}
                rx={3}
                fill="none"
                stroke={theme.inkSoft}
                strokeDasharray="5 4"
                strokeWidth={1.4}
              />
              <rect x={ghost.x} y={ghost.y} width={ghost.sliceW} height={ghost.h} rx={3} fill={context.sliceColor ?? theme.ink} />
              <text
                x={ghost.x + ghost.w - 10}
                y={ghost.y + 22}
                textAnchor="end"
                style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, fill: theme.inkSoft }}
              >
                {pctOf(context.subsetValue, context.parentValue)} of {formatValue(context.parentValue)}
              </text>
              <path d={ghost.expandPath} fill={context.sliceColor ?? theme.ink} opacity={0.16} />
            </g>
          )}

          {/* ribbons */}
          {ribbons.map((r, i) => {
            const key = `r${i}`;
            const dimd = isDim("ribbon", key, r);
            const on = revealed.has(r.bandIdx);
            const label = `${r.srcNode.label} → ${r.tgtNode.label} · ${formatValue(r.value)} (${pct(r.value)})`;
            return (
              <path
                key={key}
                d={r.path}
                fill={r.srcNode.id === "__root__" ? nodeColor(r.tgtNode) : nodeColor(r.srcNode)}
                opacity={on ? (dimd ? 0.08 : hover ? 0.55 : 0.32) : 0}
                style={{ transition: "opacity 500ms ease" }}
                onMouseEnter={(e) => {
                  setHover({ type: "ribbon", key, ids: r });
                  showTip(e, label);
                }}
                onMouseMove={(e) => showTip(e, label)}
                onMouseLeave={clearHover}
              />
            );
          })}

          {/* bands */}
          {bands.map((band, bi) => {
            const on = revealed.has(bi);
            return (
              <g
                key={bi}
                style={{
                  opacity: on ? 1 : 0,
                  transform: on ? "translateY(0)" : "translateY(18px)",
                  transition: "opacity 500ms ease, transform 500ms ease",
                }}
              >
                <text
                  x={padX}
                  y={band.y - 26}
                  style={{
                    fontSize: 12,
                    letterSpacing: "0.14em",
                    fontWeight: 700,
                    fill: theme.inkSoft,
                    textTransform: "uppercase",
                  }}
                >
                  {bi === 0 ? "Baseline" : `Dimension ${bi} — ${band.dimension}`}
                </text>
                <text
                  x={viewW - padX}
                  y={band.y - 26}
                  textAnchor="end"
                  style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fill: theme.inkSoft }}
                >
                  Σ {formatValue(data.root.value)}
                </text>
                <line x1={padX} x2={viewW - padX} y1={band.y - 16} y2={band.y - 16} stroke={theme.rule} />

                {band.nodes.map((n, ni) => {
                  const dimd = isDim("node", n.id, null);
                  const linked = new Set(
                    ribbons.filter((r) => r.from === n.id || r.to === n.id).flatMap((r) => [r.from, r.to])
                  );
                  const isRoot = n.id === "__root__";
                  const clickable = !isRoot && !!onNodeClick;
                  const valueLine =
                    isRoot && context
                      ? `${formatValue(n.value)} · ${pctOf(n.value, context.grandTotal)} of ${context.grandLabel}`
                      : `${formatValue(n.value)} · ${pct(n.value)}`;
                  const tipText = clickable
                    ? `${n.label} · ${formatValue(n.value)} (${pct(n.value)}) — click to drill in`
                    : `${n.label} · ${valueLine}`;
                  return (
                    <g
                      key={n.id}
                      opacity={dimd ? 0.25 : 1}
                      style={{ transition: "opacity 300ms ease", cursor: clickable ? "pointer" : "default" }}
                      onClick={clickable ? () => onNodeClick(n) : undefined}
                      onMouseEnter={(e) => {
                        setHover({ type: "node", key: n.id, linked });
                        showTip(e, tipText);
                      }}
                      onMouseMove={(e) => showTip(e, tipText)}
                      onMouseLeave={clearHover}
                    >
                      <rect
                        x={n.x}
                        y={band.y}
                        width={n.w}
                        height={nodeH}
                        rx={3}
                        fill={n.unmapped ? "url(#hatch)" : nodeColor(n)}
                        stroke={n.unmapped ? theme.unmapped : "none"}
                        strokeWidth={n.unmapped ? 1.5 : 0}
                      />
                      {n.w > 130 && (
                        <>
                          <text
                            x={n.x + 10}
                            y={band.y + 20}
                            style={{ fontSize: 13, fontWeight: 700, fill: n.unmapped ? theme.ink : "#FFF" }}
                          >
                            {n.label}
                          </text>
                          <text
                            x={n.x + 10}
                            y={band.y + 37}
                            style={{
                              fontFamily: "'IBM Plex Mono', monospace",
                              fontSize: 11.5,
                              fill: n.unmapped ? theme.ink : "#FFF",
                              opacity: 0.85,
                            }}
                          >
                            {valueLine}
                          </text>
                        </>
                      )}
                      {n.w <= 130 && (
                        <text
                          x={n.x + n.w / 2}
                          y={band.y + nodeH + (ni % 2 === 0 ? 16 : 31)}
                          textAnchor="middle"
                          style={{ fontSize: 11, fill: theme.inkSoft, fontWeight: 500 }}
                        >
                          {n.label} · {formatValue(n.value)}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>

        {tip && (
          <div
            style={{
              position: "absolute",
              left: Math.min(tip.x + 14, 600),
              top: tip.y - 36,
              background: theme.ink,
              color: "#fff",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 12,
              padding: "6px 10px",
              borderRadius: 4,
              pointerEvents: "none",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
            }}
          >
            {tip.text}
          </div>
        )}
      </div>

      <footer
        style={{
          maxWidth: 920,
          margin: "24px auto 0",
          padding: "14px 24px 0",
          borderTop: `1px solid ${theme.rule}`,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 12,
          color: theme.inkSoft,
        }}
      >
        <span>@kaihamil/flow-sankey · drill by click · zoom out via scope band</span>
        <span>total conserved at every level</span>
      </footer>
    </div>
  );
}
