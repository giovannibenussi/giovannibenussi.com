import { diff } from 'deep-diff';
import type { Diff } from 'deep-diff';
import type { DiffItem, DiffKind, DiffResult, DiffSummary, JsonParseResult } from './types';

export function parseJson(input: string): JsonParseResult {
  if (!input.trim()) {
    return { success: false, error: 'Empty input' };
  }

  try {
    const data = JSON.parse(input);
    return { success: true, data };
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Invalid JSON';
    return { success: false, error };
  }
}

function mapDiffKind(kind: string): DiffKind {
  switch (kind) {
    case 'N':
      return 'added';
    case 'D':
      return 'removed';
    case 'E':
      return 'modified';
    case 'A':
      return 'modified';
    default:
      return 'unchanged';
  }
}

function flattenArrayDiff(d: Diff<unknown, unknown>): DiffItem[] {
  if (d.kind === 'A' && d.item) {
    const basePath = d.path || [];
    const indexPath = [...basePath, String(d.index)];
    const item = d.item as { kind: string; lhs?: unknown; rhs?: unknown };

    return [{
      path: indexPath,
      kind: mapDiffKind(item.kind),
      lhs: item.lhs,
      rhs: item.rhs,
    }];
  }

  const diffAny = d as { kind: string; lhs?: unknown; rhs?: unknown; path?: (string | number)[] };
  return [{
    path: (diffAny.path || []).map(String),
    kind: mapDiffKind(diffAny.kind),
    lhs: diffAny.lhs,
    rhs: diffAny.rhs,
  }];
}

export function computeDiff(left: unknown, right: unknown): DiffResult {
  const differences = diff(left, right) || [];

  const diffs: DiffItem[] = differences.flatMap(flattenArrayDiff);

  const summary: DiffSummary = {
    added: diffs.filter(d => d.kind === 'added').length,
    removed: diffs.filter(d => d.kind === 'removed').length,
    modified: diffs.filter(d => d.kind === 'modified').length,
  };

  return { diffs, summary };
}

export function formatPath(path: string[]): string {
  if (path.length === 0) return 'root';
  return path.join('.');
}

export function formatValue(value: unknown): string {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return '[Object]';
    }
  }
  return String(value);
}
