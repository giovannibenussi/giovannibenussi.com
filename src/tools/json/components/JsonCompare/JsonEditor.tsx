import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { Button } from '@radix-ui/themes';
import type { JsonParseResult, DiffItem } from '../../utils/types';
import { computeLineHighlightsSimple } from '../../utils/lineMapping';
import {
  JsonCodeEditor,
  type JsonCodeEditorHandle,
  type LineHighlight,
} from '../JsonCodeEditor';

interface JsonEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  parseResult: JsonParseResult;
  diffs: DiffItem[];
  side: 'left' | 'right';
  showFormatButton?: boolean;
  formatOnPaste?: boolean;
  onScroll?: (scrollTop: number) => void;
}

export interface JsonEditorHandle {
  scrollTo: (scrollTop: number) => void;
  scrollToLine: (lineNumber: number) => void;
}

export const JsonEditor = forwardRef<JsonEditorHandle, JsonEditorProps>(function JsonEditor(
  {
    label: _label,
    value,
    onChange,
    parseResult,
    diffs,
    side,
    showFormatButton = true,
    formatOnPaste = false,
    onScroll,
  },
  ref,
) {
  const innerRef = useRef<JsonCodeEditorHandle>(null);
  const hasContent = value.trim().length > 0;

  useImperativeHandle(
    ref,
    () => ({
      scrollTo: (scrollTop) => innerRef.current?.scrollTo(scrollTop),
      scrollToLine: (lineNumber) => innerRef.current?.scrollToLine(lineNumber),
    }),
    [],
  );

  // Convert the diff map into CodeMirror line highlights (1-indexed).
  const highlights = useMemo<LineHighlight[]>(() => {
    if (!parseResult.success || diffs.length === 0) return [];
    const lineMap = computeLineHighlightsSimple(value, diffs, side);
    const result: LineHighlight[] = [];
    lineMap.forEach((kind, lineIndex) => {
      result.push({ line: lineIndex + 1, kind });
    });
    return result;
  }, [value, diffs, side, parseResult.success]);

  const handleFormat = () => {
    if (parseResult.success && parseResult.data !== undefined) {
      onChange(JSON.stringify(parseResult.data, null, 2));
    }
  };

  const handlePasteFormatted = formatOnPaste
    ? (pasted: string) => {
        try {
          const parsed = JSON.parse(pasted);
          onChange(JSON.stringify(parsed, null, 2));
          return true;
        } catch {
          return false;
        }
      }
    : undefined;

  return (
    <div className="flex flex-col gap-2 h-full min-h-0">
      <div
        className="flex-1 min-h-0 rounded-xl overflow-hidden border"
        style={{ borderColor: 'var(--dracula-border)' }}
      >
        <JsonCodeEditor
          ref={innerRef}
          value={value}
          onChange={onChange}
          highlights={highlights}
          onScroll={onScroll}
          onPasteFormatted={handlePasteFormatted}
          height="100%"
        />
      </div>

      {showFormatButton && (
        <div className="flex justify-end items-center shrink-0">
          <Button
            variant="soft"
            size="1"
            onClick={handleFormat}
            disabled={!parseResult.success}
            title={parseResult.success ? 'Format JSON' : 'Fix JSON errors to format'}
          >
            Format
          </Button>
        </div>
      )}

      {/* Reserve space for error message to keep both sides aligned */}
      <div className="shrink-0 min-h-[2rem]">
        {hasContent && !parseResult.success && parseResult.error && (
          <div className="p-3 bg-[var(--dracula-red)]/10 border border-[var(--dracula-red)]/30 rounded-lg text-[var(--dracula-red)] text-xs font-mono">
            {parseResult.error}
          </div>
        )}
      </div>
    </div>
  );
});
