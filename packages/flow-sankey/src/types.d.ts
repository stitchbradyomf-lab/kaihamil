declare module '@kaihamil/flow-sankey' {
  import * as React from 'react';

  export const OTHER_KEY: string;
  export const UNMAPPED_KEY: string;

  export interface Theme {
    bg: string;
    ink: string;
    inkSoft: string;
    rule: string;
    palette: string[];
    unmapped: string;
  }

  export const defaultTheme: Theme;

  export interface Dimension {
    field: string;
    label: string;
    topN?: number;
  }

  export interface FlowsToSankeyOptions {
    unit: string;
    rootLabel: string;
    valueField: string;
    dimensions: Dimension[];
  }

  export interface SankeyNode {
    id: string;
    key: string;
    label: string;
    value: number;
    field: string;
    unmapped?: boolean;
    colorIdx: number;
    rolledKeys?: string[];
  }

  export interface SankeyLevel {
    dimension: string;
    field: string;
    nodes: SankeyNode[];
  }

  export interface SankeyData {
    unit: string;
    root: {
      label: string;
      value: number;
    };
    levels: SankeyLevel[];
  }

  export function flowsToSankey<T extends Record<string, any>>(
    rows: T[],
    options: FlowsToSankeyOptions
  ): SankeyData;

  export interface VerticalSankeyProps {
    data: SankeyData;
    context?: {
      parentLabel: string;
      parentValue: number;
      subsetValue: number;
      grandTotal: number;
      grandLabel: string;
      sliceColor?: string;
    } | null;
    breadcrumb?: Array<{ label: string; onClick?: (() => void) | null }>;
    dimensionLadder?: Array<{ field: string; label: string }>;
    onApplyOrder?: (fields: string[]) => void;
    onNodeClick?: (node: SankeyNode) => void;
    onZoomOut?: () => void;
    theme?: Theme;
    title?: string;
    subtitle?: string;
    formatValue?: (value: number) => string;
  }

  export function VerticalSankey(props: VerticalSankeyProps): React.ReactElement;

  export interface LayoutBand {
    dimension: string;
    y: number;
    nodes: Array<{
      id: string;
      label: string;
      value: number;
      x: number;
      w: number;
      colorIdx: number;
    }>;
  }

  export interface LayoutRibbon {
    bandIdx: number;
    srcNode: SankeyNode;
    tgtNode: SankeyNode;
    path: string;
    value: number;
  }

  export interface LayoutGhost {
    y: number;
    h: number;
    x: number;
    w: number;
    sliceW: number;
    expandPath?: string;
  }

  export interface Layout {
    bands: LayoutBand[];
    ribbons: LayoutRibbon[];
    ghost: LayoutGhost | null;
    viewW: number;
    totalH: number;
    nodeH: number;
    padX: number;
  }

  export function computeLayout(
    data: SankeyData,
    context: VerticalSankeyProps['context'],
    opts?: { viewW?: number }
  ): Layout;
}
