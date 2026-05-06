export type DiffKind = 'added' | 'removed' | 'modified' | 'unchanged';

export interface DiffItem {
  path: string[];
  kind: DiffKind;
  lhs?: unknown;
  rhs?: unknown;
}

export interface DiffSummary {
  added: number;
  removed: number;
  modified: number;
}

export interface DiffResult {
  diffs: DiffItem[];
  summary: DiffSummary;
}

export interface JsonParseResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

export interface JsonValue {
  [key: string]: unknown;
}
