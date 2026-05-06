import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import CodeMirror, { EditorView, type ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { json as jsonLang } from '@codemirror/lang-json';
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import { githubLight } from '@uiw/codemirror-theme-github';
import {
  StateEffect,
  StateField,
  RangeSetBuilder,
  type Extension,
} from '@codemirror/state';
import { Decoration, type DecorationSet } from '@codemirror/view';

export type LineHighlightKind = 'added' | 'removed' | 'modified' | 'flash';

export interface LineHighlight {
  line: number; // 1-indexed
  kind: LineHighlightKind;
}

export interface JsonCodeEditorHandle {
  scrollTo: (scrollTop: number) => void;
  scrollToLine: (lineNumber: number) => void;
}

interface JsonCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
  readOnly?: boolean;
  placeholder?: string;
  onPasteFormatted?: (formatted: string) => boolean;
  onScroll?: (scrollTop: number) => void;
  highlights?: LineHighlight[];
}

function useIsDark(): boolean {
  const [isDark, setIsDark] = useState(() => {
    if (typeof document === 'undefined') return true;
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains('dark'));
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

// --- Line highlight decoration machinery ---

const setHighlightsEffect = StateEffect.define<LineHighlight[]>();

const highlightField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(deco, tr) {
    deco = deco.map(tr.changes);
    for (const effect of tr.effects) {
      if (effect.is(setHighlightsEffect)) {
        const builder = new RangeSetBuilder<Decoration>();
        const doc = tr.state.doc;
        const sorted = [...effect.value].sort((a, b) => a.line - b.line);
        for (const h of sorted) {
          if (h.line < 1 || h.line > doc.lines) continue;
          const line = doc.line(h.line);
          builder.add(
            line.from,
            line.from,
            Decoration.line({ attributes: { class: `cm-diff-line cm-diff-${h.kind}` } }),
          );
        }
        deco = builder.finish();
      }
    }
    return deco;
  },
  provide: (f) => EditorView.decorations.from(f),
});

const highlightTheme = EditorView.baseTheme({
  '.cm-diff-modified': { backgroundColor: 'rgba(255, 184, 108, 0.18)', borderLeft: '2px solid #ffb86c' },
  '.cm-diff-added': { backgroundColor: 'rgba(80, 250, 123, 0.15)', borderLeft: '2px solid #50fa7b' },
  '.cm-diff-removed': { backgroundColor: 'rgba(255, 85, 85, 0.15)', borderLeft: '2px solid #ff5555' },
  '.cm-diff-flash': {
    backgroundColor: 'rgba(189, 147, 249, 0.25)',
    outline: '2px solid #bd93f9',
    animation: 'cm-diff-flash-pulse 1.5s ease-out',
  },
  '@keyframes cm-diff-flash-pulse': {
    '0%': { backgroundColor: 'rgba(189, 147, 249, 0.45)' },
    '100%': { backgroundColor: 'rgba(189, 147, 249, 0.25)' },
  },
});

export const JsonCodeEditor = forwardRef<JsonCodeEditorHandle, JsonCodeEditorProps>(
  function JsonCodeEditor(
    {
      value,
      onChange,
      height = '70vh',
      readOnly = false,
      placeholder,
      onPasteFormatted,
      onScroll,
      highlights,
    },
    ref,
  ) {
    const isDark = useIsDark();
    const cmRef = useRef<ReactCodeMirrorRef>(null);
    const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Base extensions: JSON + line wrap + our highlight field/theme.
    const extensions = useMemo<Extension[]>(() => {
      const base: Extension[] = [jsonLang(), EditorView.lineWrapping, highlightField, highlightTheme];

      if (onPasteFormatted) {
        base.push(
          EditorView.domEventHandlers({
            paste(event, view) {
              const pasted = event.clipboardData?.getData('text');
              if (!pasted) return false;
              const handled = onPasteFormatted(pasted);
              if (handled) {
                event.preventDefault();
                requestAnimationFrame(() => {
                  view.dispatch({ selection: { anchor: view.state.doc.length } });
                });
                return true;
              }
              return false;
            },
          }),
        );
      }

      if (onScroll) {
        base.push(
          EditorView.domEventHandlers({
            scroll(_event, view) {
              onScroll(view.scrollDOM.scrollTop);
            },
          }),
        );
      }

      return base;
    }, [onPasteFormatted, onScroll]);

    // Sync the highlight set into the editor whenever it changes.
    useEffect(() => {
      const view = cmRef.current?.view;
      if (!view) return;
      view.dispatch({ effects: setHighlightsEffect.of(highlights ?? []) });
    }, [highlights]);

    // Imperative handle used by JsonCompare for sync scroll and scroll-to-line.
    useImperativeHandle(
      ref,
      () => ({
        scrollTo: (scrollTop: number) => {
          const view = cmRef.current?.view;
          if (!view) return;
          view.scrollDOM.scrollTop = scrollTop;
        },
        scrollToLine: (lineNumber: number) => {
          const view = cmRef.current?.view;
          if (!view) return;
          const doc = view.state.doc;
          if (lineNumber < 1 || lineNumber > doc.lines) return;
          const line = doc.line(lineNumber);
          view.dispatch({
            effects: EditorView.scrollIntoView(line.from, { y: 'center' }),
          });
          // Flash the line for ~1.5s.
          const base = (highlights ?? []).filter((h) => h.line !== lineNumber);
          view.dispatch({
            effects: setHighlightsEffect.of([...base, { line: lineNumber, kind: 'flash' }]),
          });
          if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
          flashTimeoutRef.current = setTimeout(() => {
            view.dispatch({ effects: setHighlightsEffect.of(highlights ?? []) });
          }, 1500);
        },
      }),
      [highlights],
    );

    useEffect(() => {
      return () => {
        if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
      };
    }, []);

    const handleChange = useCallback((v: string) => onChange(v), [onChange]);

    return (
      <CodeMirror
        ref={cmRef}
        value={value}
        onChange={handleChange}
        theme={isDark ? tokyoNight : githubLight}
        extensions={extensions}
        height={height}
        readOnly={readOnly}
        placeholder={placeholder}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          highlightActiveLine: true,
          highlightActiveLineGutter: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: false,
          indentOnInput: true,
        }}
      />
    );
  },
);
