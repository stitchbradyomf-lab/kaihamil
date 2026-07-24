import React, { useMemo, useState } from "react";
import { flowsToSankey, VerticalSankey, defaultTheme, OTHER_KEY } from "../src/index.js";

/* Reference controller: the host app owns rows, the filter stack, and
   dimension order. Copy this pattern per app — the package itself owns
   none of this state. Replace SAMPLE_ROWS with a fetch of your rows
   endpoint (see README: the endpoint must return ROWS, not aggregates). */

const SAMPLE_ROWS = [
  { amount: 2300, cf_section: "Operating", category: "Housing", account: "Joint Checking" },
  { amount: 1100, cf_section: "Financing", category: "Debt Principal", account: "Joint Checking" },
  { amount: 1420, cf_section: "Operating", category: "Groceries", account: "Amex" },
  { amount: 486, cf_section: "Operating", category: "Utilities", account: "Joint Checking" },
  { amount: 148, cf_section: "Operating", category: "Subscriptions", account: "Amex" },
  { amount: 512, cf_section: "Operating", category: "Insurance", account: "Joint Checking" },
  { amount: 634, cf_section: "Operating", category: "Dining & Social", account: "Amex" },
  { amount: 540, cf_section: "Operating", category: "Kids", account: "Amex" },
  { amount: 388, cf_section: "Operating", category: "Auto", account: "Amex" },
  { amount: 980, cf_section: "Operating", category: "Travel", account: "Amex" },
  { amount: 1500, cf_section: "Investing", category: "Brokerage Contributions", account: "Joint Checking" },
  { amount: 600, cf_section: "Investing", category: "529 Contributions", account: "Joint Checking" },
  { amount: 850, cf_section: "Investing", category: "Home Capital", account: "Joint Checking" },
  { amount: 240, cf_section: null, category: null, account: "Amex" },
];

const BASE_DIMENSIONS = [
  { field: "cf_section", label: "CF Section" },
  { field: "category", label: "Category", topN: 6 },
  { field: "account", label: "Account" },
];

const GRAND_LABEL = "June Outflows";

export default function FinanceFlowDemo() {
  const rows = SAMPLE_ROWS;
  const usd = (v) => `$${v.toLocaleString()}`;

  // filter stack: { type: 'value'|'other'|'unmapped', field, value?, keys?, display, dimLabel, color }
  const [stack, setStack] = useState([]);
  // ladder order (fields); consumed fields keep their slot but drop out of the render
  const [dimOrder, setDimOrder] = useState(() => BASE_DIMENSIONS.map((d) => d.field));

  const applyFilters = (rs, filters) =>
    filters.reduce((acc, f) => {
      if (f.type === "value") return acc.filter((r) => String(r[f.field] ?? "") === f.value);
      if (f.type === "unmapped") return acc.filter((r) => r[f.field] == null || r[f.field] === "");
      return acc.filter((r) => f.keys.includes(String(r[f.field] ?? "")));
    }, rs);

  const view = useMemo(() => {
    const grandTotal = rows.reduce((s, r) => s + r.amount, 0);
    const currentRows = applyFilters(rows, stack);
    const parentRows = stack.length ? applyFilters(rows, stack.slice(0, -1)) : rows;

    const otherFields = new Set(stack.filter((f) => f.type === "other").map((f) => f.field));
    const consumed = new Set(stack.filter((f) => f.type !== "other").map((f) => f.field));
    const byField = Object.fromEntries(BASE_DIMENSIONS.map((d) => [d.field, d]));
    const dimensions = dimOrder
      .map((f) => byField[f])
      .filter((d) => d && !consumed.has(d.field))
      .map((d) => (otherFields.has(d.field) ? { ...d, topN: undefined } : d));

    const last = stack[stack.length - 1];
    const data = flowsToSankey(currentRows, {
      unit: "USD",
      rootLabel: last ? last.display : "Total Outflows — June 2026",
      valueField: "amount",
      dimensions,
    });

    const context = stack.length
      ? {
          parentLabel: stack.length > 1 ? stack[stack.length - 2].display : GRAND_LABEL,
          parentValue: parentRows.reduce((s, r) => s + r.amount, 0),
          subsetValue: data.root.value,
          grandTotal,
          grandLabel: GRAND_LABEL,
          sliceColor: last?.color,
        }
      : null;

    return { data, context, dimensions };
  }, [rows, stack, dimOrder]);

  const handleNodeClick = (node) => {
    const dimLabel = BASE_DIMENSIONS.find((d) => d.field === node.field)?.label ?? node.field;
    const color = node.unmapped
      ? defaultTheme.unmapped
      : defaultTheme.palette[node.colorIdx % defaultTheme.palette.length];
    if (node.key === OTHER_KEY)
      setStack((s) => [...s, { type: "other", field: node.field, keys: node.rolledKeys, display: `Other ${dimLabel}`, dimLabel, color }]);
    else if (node.unmapped)
      setStack((s) => [...s, { type: "unmapped", field: node.field, display: `Unmapped ${dimLabel}`, dimLabel, color }]);
    else setStack((s) => [...s, { type: "value", field: node.field, value: node.key, display: node.label, dimLabel, color }]);
  };

  const applyOrder = (activeFields) =>
    setDimOrder((order) => {
      const consumed = new Set(stack.filter((f) => f.type !== "other").map((f) => f.field));
      const next = [...order];
      let k = 0;
      for (let i = 0; i < next.length; i++) {
        if (!consumed.has(next[i])) next[i] = activeFields[k++];
      }
      return next;
    });

  const breadcrumb = [
    { label: GRAND_LABEL, onClick: stack.length ? () => setStack([]) : null },
    ...stack.map((f, i) => ({
      label: f.display,
      onClick: i < stack.length - 1 ? () => setStack(stack.slice(0, i + 1)) : null,
    })),
  ];

  return (
    <VerticalSankey
      data={view.data}
      context={view.context}
      breadcrumb={breadcrumb}
      dimensionLadder={view.dimensions.map((d) => ({ field: d.field, label: d.label }))}
      onApplyOrder={applyOrder}
      onNodeClick={handleNodeClick}
      onZoomOut={() => setStack((s) => s.slice(0, -1))}
      title="Where June Went"
      subtitle="Click any band to make it the new total. The dashed scope band above the root shows what you're inside of — your slice at true width — and clicking it zooms back out."
      formatValue={usd}
    />
  );
}
