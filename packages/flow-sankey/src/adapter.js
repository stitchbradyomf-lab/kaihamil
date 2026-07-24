/* flowsToSankey — pure, framework-free adapter.
   Transforms row-level records into the VerticalSankey data contract.

   options:
   {
     unit: "USD",
     rootLabel: "Total Outflows — June 2026",
     valueField: "amount",
     dimensions: [
       { field: "cf_section", label: "CF Section" },
       { field: "category",   label: "Category", topN: 6 },  // rollup → "Other (n)"
       { field: "account",    label: "Account" },
     ],
   }

   Null/empty field values route to a hatched "Unmapped" node.
   Conservation holds by construction: every dimension is a re-grouping
   of the same row set. Special node keys: "__other__", "__unmapped__".
*/

export const OTHER_KEY = "__other__";
export const UNMAPPED_KEY = "__unmapped__";

export function flowsToSankey(rows, options) {
  const { rootLabel, unit = "", valueField = "amount", dimensions } = options;

  const resolved = rows.map((r) => ({
    value: Number(r[valueField]) || 0,
    dims: dimensions.map((d) => {
      const v = r[d.field];
      return v == null || v === "" ? UNMAPPED_KEY : String(v);
    }),
  }));

  const total = resolved.reduce((s, r) => s + r.value, 0);

  const dimNodes = dimensions.map((d, di) => {
    const sums = {};
    resolved.forEach((r) => (sums[r.dims[di]] = (sums[r.dims[di]] || 0) + r.value));
    const entries = Object.entries(sums)
      .filter(([k]) => k !== UNMAPPED_KEY)
      .sort((a, z) => z[1] - a[1]);

    let keep = entries;
    let rolled = [];
    if (d.topN && entries.length > d.topN) {
      keep = entries.slice(0, d.topN);
      rolled = entries.slice(d.topN);
    }
    const keepKeys = new Set(keep.map(([k]) => k));
    if (rolled.length) {
      // rewrite rolled-up values on the rows so downstream crosstabs stay consistent
      resolved.forEach((r) => {
        if (r.dims[di] !== UNMAPPED_KEY && !keepKeys.has(r.dims[di])) r.dims[di] = OTHER_KEY;
      });
    }

    const nodes = keep.map(([k, v]) => ({ id: `d${di}:${k}`, key: k, label: k, value: v, field: d.field }));
    if (rolled.length)
      nodes.push({
        id: `d${di}:${OTHER_KEY}`,
        key: OTHER_KEY,
        label: `Other (${rolled.length})`,
        value: rolled.reduce((s, [, v]) => s + v, 0),
        field: d.field,
        rolledKeys: rolled.map(([k]) => k),
      });
    if (sums[UNMAPPED_KEY])
      nodes.push({
        id: `d${di}:${UNMAPPED_KEY}`,
        key: UNMAPPED_KEY,
        label: "Unmapped",
        value: sums[UNMAPPED_KEY],
        unmapped: true,
        field: d.field,
      });
    return nodes;
  });

  const levels = dimensions.map((d, di) => {
    const level = { dimension: d.label ?? d.field, field: d.field, nodes: dimNodes[di] };
    if (di > 0) {
      const pair = {};
      resolved.forEach((r) => {
        const k = `${r.dims[di - 1]}\u0000${r.dims[di]}`;
        pair[k] = (pair[k] || 0) + r.value;
      });
      level.flows = Object.entries(pair).map(([k, v]) => {
        const [a, b] = k.split("\u0000");
        return { from: `d${di - 1}:${a}`, to: `d${di}:${b}`, value: v };
      });
    }
    return level;
  });

  return { unit, root: { label: rootLabel, value: total }, levels };
}
