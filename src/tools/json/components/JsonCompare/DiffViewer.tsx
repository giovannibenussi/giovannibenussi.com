import { useMemo } from 'react';
import type { DiffResult, DiffKind } from '../../utils/types';
import { formatPath, formatValue } from '../../utils/jsonDiff';
import { computeDiffLineNumbers, type DiffWithLines } from '../../utils/lineMapping';
import { AddedIcon, RemovedIcon, ModifiedIcon } from '../DiffIcons';

interface DiffViewerProps {
  diffResult: DiffResult | null;
  leftValid: boolean;
  rightValid: boolean;
  leftJson: string;
  rightJson: string;
  onDiffClick?: (leftLine: number | null, rightLine: number | null) => void;
}

interface DiffLineProps {
  item: DiffWithLines;
  onClick?: () => void;
}

// Row surface tint — subtle amber/emerald/rose bands matching the blog palette.
const ROW_TONE: Record<DiffKind, string> = {
  modified:
    'bg-amber-50/70 border-l-2 border-amber-400 hover:bg-amber-100/60 dark:bg-amber-500/5 dark:border-amber-400/70 dark:hover:bg-amber-500/10',
  added:
    'bg-emerald-50/70 border-l-2 border-emerald-400 hover:bg-emerald-100/60 dark:bg-emerald-500/5 dark:border-emerald-400/70 dark:hover:bg-emerald-500/10',
  removed:
    'bg-rose-50/70 border-l-2 border-rose-400 hover:bg-rose-100/60 dark:bg-rose-500/5 dark:border-rose-400/70 dark:hover:bg-rose-500/10',
  unchanged: '',
};

const BADGE_TONE: Record<DiffKind, string> = {
  modified:
    'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
  added:
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300',
  removed:
    'bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300',
  unchanged: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
};

function KindIcon({ kind, className }: { kind: DiffKind; className?: string }) {
  if (kind === 'added') return <AddedIcon className={className} />;
  if (kind === 'removed') return <RemovedIcon className={className} />;
  if (kind === 'modified') return <ModifiedIcon className={className} />;
  return null;
}

function DiffLine({ item, onClick }: DiffLineProps) {
  const path = formatPath(item.path);

  const formatLineNumbers = () => {
    if (item.kind === 'added') return item.rightLine ? `R:${item.rightLine}` : '—';
    if (item.kind === 'removed') return item.leftLine ? `L:${item.leftLine}` : '—';
    const left = item.leftLine ? `L:${item.leftLine}` : '—';
    const right = item.rightLine ? `R:${item.rightLine}` : '—';
    return `${left} / ${right}`;
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left font-mono text-sm transition-colors ${ROW_TONE[item.kind]}`}
    >
      <span className="min-w-[70px] text-xs tabular-nums text-slate-500 dark:text-slate-400">
        {formatLineNumbers()}
      </span>
      <span className="min-w-[100px] truncate font-medium text-indigo-600 dark:text-indigo-400">
        {path}
      </span>
      <span className="flex-1 overflow-hidden truncate">
        {item.kind === 'modified' ? (
          <>
            <span className="text-rose-600 line-through opacity-70 dark:text-rose-400">
              {formatValue(item.lhs)}
            </span>
            <span className="mx-2 text-slate-400 dark:text-slate-500">→</span>
            <span className="text-emerald-700 dark:text-emerald-400">
              {formatValue(item.rhs)}
            </span>
          </>
        ) : item.kind === 'added' ? (
          <span className="text-emerald-700 dark:text-emerald-400">
            {formatValue(item.rhs)}
          </span>
        ) : (
          <span className="text-rose-600 dark:text-rose-400">
            {formatValue(item.lhs)}
          </span>
        )}
      </span>
      <span
        className={`inline-flex w-[92px] shrink-0 items-center justify-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide ${BADGE_TONE[item.kind]}`}
      >
        <KindIcon kind={item.kind} className="size-3" />
        {item.kind}
      </span>
    </button>
  );
}

export function DiffViewer({
  diffResult,
  leftValid,
  rightValid,
  leftJson,
  rightJson,
  onDiffClick,
}: DiffViewerProps) {
  const diffsWithLines = useMemo(() => {
    if (!diffResult) return [];
    return computeDiffLineNumbers(leftJson, rightJson, diffResult.diffs);
  }, [diffResult, leftJson, rightJson]);

  if (!leftValid || !rightValid) {
    return (
      <div className="shrink-0 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
        Enter valid JSON in both editors to see differences
      </div>
    );
  }

  if (!diffResult || diffResult.diffs.length === 0) {
    return (
      <div className="shrink-0 rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-500/30 dark:bg-emerald-500/10">
        <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22,4 12,14.01 9,11.01" />
          </svg>
          Both JSON objects are identical
        </span>
      </div>
    );
  }

  const { summary } = diffResult;
  const summaryParts: { count: number; kind: DiffKind; label: string }[] = [];
  if (summary.modified > 0)
    summaryParts.push({ count: summary.modified, kind: 'modified', label: 'modified' });
  if (summary.added > 0)
    summaryParts.push({ count: summary.added, kind: 'added', label: 'added' });
  if (summary.removed > 0)
    summaryParts.push({ count: summary.removed, kind: 'removed', label: 'removed' });

  return (
    <div className="shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-50/60 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900/80">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-indigo-500 dark:text-indigo-400"
          aria-hidden="true"
        >
          <path d="M16 3h5v5M8 3H3v5M3 16v5h5M21 16v5h-5M12 8v8M8 12h8" />
        </svg>
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Differences
        </span>
        <span className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          {summaryParts.map((part, i) => (
            <span key={part.kind} className="inline-flex items-center gap-1">
              {i > 0 && <span className="text-slate-300 dark:text-slate-600">·</span>}
              <KindIcon
                kind={part.kind}
                className={`size-3.5 ${
                  part.kind === 'modified'
                    ? 'text-amber-500 dark:text-amber-400'
                    : part.kind === 'added'
                      ? 'text-emerald-500 dark:text-emerald-400'
                      : 'text-rose-500 dark:text-rose-400'
                }`}
              />
              <span className="tabular-nums">
                {part.count} {part.label}
              </span>
            </span>
          ))}
        </span>
      </div>
      <div className="flex max-h-[260px] flex-col gap-1 overflow-y-auto p-2">
        {diffsWithLines.map((item, index) => (
          <DiffLine
            key={`${item.path.join('.')}-${index}`}
            item={item}
            onClick={() => onDiffClick?.(item.leftLine, item.rightLine)}
          />
        ))}
      </div>
    </div>
  );
}
