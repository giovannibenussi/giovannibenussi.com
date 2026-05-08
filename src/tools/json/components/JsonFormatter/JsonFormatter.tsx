import { useCallback, useEffect, useRef, useState } from 'react';
import { Badge, Button, Callout, Code, HoverCard, IconButton, Kbd, Text, TextField, Tooltip } from '@radix-ui/themes';
import { CopyIcon, CheckIcon, CrossCircledIcon, InfoCircledIcon, MagnifyingGlassIcon, TrashIcon } from '@radix-ui/react-icons';
import { jsonrepair } from 'jsonrepair';
import { JsonCodeEditor } from '../JsonCodeEditor';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const RECENT_LIMIT = 5;
const RECENT_STORAGE_KEY = 'json-format-recent-filters';

const SAMPLE_JSON = `{
  "name": "John Doe",
  "age": 30,
  "ciudades": ["New York", "Los Angeles", "Chicago"]
}`;

function evaluateQuery(data: unknown, query: string): unknown {
  if (!query.trim()) return data;

  // Remove surrounding quotes if present
  let path = query.trim();
  if ((path.startsWith("'") && path.endsWith("'")) || (path.startsWith('"') && path.endsWith('"'))) {
    path = path.slice(1, -1);
  }

  // Remove leading dot if present
  if (path.startsWith('.')) {
    path = path.slice(1);
  }

  if (!path) return data;

  // Parse the path - handle both dot notation and bracket notation
  const tokens: (string | number)[] = [];
  let current = '';
  let i = 0;

  while (i < path.length) {
    const char = path[i];

    if (char === '.') {
      if (current) {
        tokens.push(current);
        current = '';
      }
      i++;
    } else if (char === '[') {
      if (current) {
        tokens.push(current);
        current = '';
      }
      i++; // skip [
      let indexStr = '';
      while (i < path.length && path[i] !== ']') {
        indexStr += path[i];
        i++;
      }
      i++; // skip ]
      // Check if it's a number or a string key
      const num = parseInt(indexStr, 10);
      if (!isNaN(num)) {
        tokens.push(num);
      } else {
        // Remove quotes from string keys
        if ((indexStr.startsWith("'") && indexStr.endsWith("'")) ||
            (indexStr.startsWith('"') && indexStr.endsWith('"'))) {
          tokens.push(indexStr.slice(1, -1));
        } else {
          tokens.push(indexStr);
        }
      }
    } else {
      current += char;
      i++;
    }
  }

  if (current) {
    tokens.push(current);
  }

  // Navigate the data
  let result: unknown = data;
  for (const token of tokens) {
    if (result === null || result === undefined) {
      return undefined;
    }
    if (typeof token === 'number' && Array.isArray(result)) {
      result = result[token];
    } else if (typeof result === 'object' && result !== null) {
      result = (result as Record<string, unknown>)[String(token)];
    } else {
      return undefined;
    }
  }

  return result;
}

function ExampleRow({
  expr,
  desc,
  onPick,
}: {
  expr: string;
  desc: string;
  onPick?: (expr: string) => void;
}) {
  const content = (
    <>
      <Code size="1" variant="soft">{expr}</Code>
      <Text size="1" color="gray">{desc}</Text>
    </>
  );

  if (!onPick) {
    return <div className="flex items-center gap-2">{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={() => onPick(expr)}
      className="flex items-center gap-2 text-left w-full cursor-pointer"
    >
      {content}
    </button>
  );
}

interface ExampleGroup {
  heading: string;
  rows: { expr: string; desc: string }[];
}

const STATIC_EXAMPLES: ExampleGroup[] = [
  {
    heading: 'Basics',
    rows: [
      { expr: '.', desc: 'the whole document' },
      { expr: '.name', desc: 'top-level key' },
    ],
  },
  {
    heading: 'Nesting',
    rows: [
      { expr: '.user.email', desc: 'walk into an object' },
      { expr: '.items[0]', desc: 'index into an array' },
      { expr: '.users[2].name', desc: 'chain both' },
    ],
  },
];

export function JsonFormatter() {
  const [json, setJson] = useState(SAMPLE_JSON);
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [recentFilters, setRecentFilters] = useLocalStorage<string[]>(RECENT_STORAGE_KEY, []);
  const filterInputRef = useRef<HTMLInputElement>(null);

  // Push a committed filter into the recent-history list (most recent first, deduped, capped).
  const pushRecent = useCallback((expr: string) => {
    const trimmed = expr.trim();
    if (!trimmed) return;
    setRecentFilters((prev) => {
      const next = [trimmed, ...prev.filter((e) => e !== trimmed)];
      return next.slice(0, RECENT_LIMIT);
    });
  }, [setRecentFilters]);

  const runPreset = useCallback((expr: string) => {
    setQuery(expr);
    pushRecent(expr);
  }, [pushRecent]);

  const clearRecent = useCallback(() => setRecentFilters([]), [setRecentFilters]);

  // "/" to focus the filter input — skip when another input/textarea is focused
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      const active = document.activeElement;
      const tag = active?.tagName.toLowerCase();
      if (
        tag === 'input' ||
        tag === 'textarea' ||
        (active as HTMLElement | null)?.isContentEditable
      ) {
        return;
      }
      e.preventDefault();
      filterInputRef.current?.focus();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleCopy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Failed to copy
    }
  }, []);

  const handleRepair = useCallback(() => {
    try {
      const repaired = jsonrepair(json);
      setJson(JSON.stringify(JSON.parse(repaired), null, 2));
    } catch {
      // Repair failed
    }
  }, [json]);

  // Parse and evaluate query
  let parsedData: unknown;
  let parseError: string | null = null;
  let errorLine: number | null = null;
  let canRepair = false;
  let queryResult: unknown;
  let queryError: string | null = null;

  try {
    parsedData = JSON.parse(json);
  } catch (e) {
    parseError = e instanceof Error ? e.message : 'Invalid JSON';
    // Extract line number from error message (format: "... at position X (line Y column Z)")
    const lineMatch = parseError.match(/line (\d+)/i);
    if (lineMatch) {
      errorLine = parseInt(lineMatch[1], 10);
    }
    // Check if repair is possible
    try {
      const repaired = jsonrepair(json);
      JSON.parse(repaired);
      canRepair = true;
    } catch {
      canRepair = false;
    }
  }

  if (parsedData !== undefined && query) {
    try {
      queryResult = evaluateQuery(parsedData, query);
    } catch (e) {
      queryError = e instanceof Error ? e.message : 'Query error';
    }
  }

  // Determine what to show on the right side
  const rightContent = query
    ? (queryResult !== undefined ? JSON.stringify(queryResult, null, 2) : '')
    : (parsedData !== undefined ? JSON.stringify(parsedData, null, 2) : '');

  // Editable draft of the result — reset whenever the computed rightContent changes
  // (i.e. when the user edits input or query).
  const [resultDraft, setResultDraft] = useState(rightContent);
  useEffect(() => {
    setResultDraft(rightContent);
  }, [rightContent]);


  // Determine if query result is invalid (undefined when query was provided)
  const hasInvalidQuery = query.trim() && parsedData !== undefined && queryResult === undefined && !queryError;

  // Generate example queries derived from the current JSON (shown inside the
  // filter help popover under a "From your JSON" group). Max 4 entries.
  const dynamicExamples: { expr: string; desc: string }[] = [];
  if (parsedData && typeof parsedData === 'object' && parsedData !== null && !Array.isArray(parsedData)) {
    const entries = Object.entries(parsedData as Record<string, unknown>);
    for (const [key, value] of entries) {
      if (dynamicExamples.length >= 4) break;
      if (Array.isArray(value) && value.length > 0) {
        dynamicExamples.push({ expr: `.${key}[0]`, desc: `first item of "${key}"` });
      } else if (value && typeof value === 'object') {
        const firstChild = Object.keys(value as Record<string, unknown>)[0];
        if (firstChild) {
          dynamicExamples.push({ expr: `.${key}.${firstChild}`, desc: `"${firstChild}" inside "${key}"` });
        } else {
          dynamicExamples.push({ expr: `.${key}`, desc: `the "${key}" object` });
        }
      } else {
        dynamicExamples.push({ expr: `.${key}`, desc: `value of "${key}"` });
      }
    }
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Filter */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Text as="label" htmlFor="json-filter" size="2" weight="medium">
              Filter
            </Text>
            <HoverCard.Root openDelay={120} closeDelay={100}>
              <HoverCard.Trigger>
                <IconButton variant="ghost" size="1" aria-label="Filter syntax help">
                  <InfoCircledIcon />
                </IconButton>
              </HoverCard.Trigger>
              <HoverCard.Content width="360px" side="bottom" align="start">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <Text size="2" weight="bold">
                      Filter syntax
                    </Text>
                    <Text size="2" color="gray">
                      A small subset of{' '}
                      <a
                        href="https://jqlang.github.io/jq/manual/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        jq
                      </a>
                      -style path notation. Click any example to run it.
                    </Text>
                  </div>

                  {STATIC_EXAMPLES.map((group) => (
                    <div key={group.heading} className="flex flex-col gap-1">
                      <Text size="1" color="gray" weight="medium">
                        {group.heading}
                      </Text>
                      <div className="flex flex-col gap-0.5">
                        {group.rows.map((r) => (
                          <ExampleRow
                            key={r.expr}
                            expr={r.expr}
                            desc={r.desc}
                            onPick={runPreset}
                          />
                        ))}
                      </div>
                    </div>
                  ))}

                  {dynamicExamples.length > 0 && (
                    <div className="flex flex-col gap-1">
                      <Text size="1" color="gray" weight="medium">
                        From your JSON
                      </Text>
                      <div className="flex flex-col gap-0.5">
                        {dynamicExamples.map((r) => (
                          <ExampleRow
                            key={r.expr}
                            expr={r.expr}
                            desc={r.desc}
                            onPick={runPreset}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <Text size="1" color="gray">
                    Not supported: filters, pipes, <code>map</code>,{' '}
                    <code>select</code>, or anything that transforms data.
                  </Text>
                </div>
              </HoverCard.Content>
            </HoverCard.Root>
          </div>
          <Text size="1" color="gray">
            press <Kbd size="1">/</Kbd> to focus
          </Text>
        </div>
        <TextField.Root
          ref={filterInputRef}
          id="json-filter"
          placeholder="jq like filter: .name, .addresses[0], etc"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onBlur={(e) => pushRecent(e.target.value)}
          size="2"
        >
          <TextField.Slot>
            <MagnifyingGlassIcon height="16" width="16" />
          </TextField.Slot>
        </TextField.Root>

        {dynamicExamples.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Text size="2" color="gray">From your JSON</Text>
            {dynamicExamples.map((ex) => (
              <Badge
                key={ex.expr}
                variant="soft"
                className="cursor-pointer"
                onClick={() => runPreset(ex.expr)}
              >
                {ex.expr}
              </Badge>
            ))}
          </div>
        )}

        {recentFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <Text size="2" color="gray">Recent</Text>
            {recentFilters.map((expr) => (
              <Badge
                key={expr}
                variant="soft"
                color="indigo"
                className="cursor-pointer"
                onClick={() => runPreset(expr)}
              >
                {expr}
              </Badge>
            ))}
            <Tooltip content="Clear recent">
              <IconButton
                variant="ghost"
                size="1"
                onClick={clearRecent}
                aria-label="Clear recent filters"
              >
                <TrashIcon />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </div>

      {/* Error callouts */}
      {parseError && (
        <Callout.Root color="red" size="1">
          <Callout.Icon>
            <CrossCircledIcon />
          </Callout.Icon>
          <Callout.Text className="flex items-center gap-2">
            {parseError}
            {canRepair ? (
              <Button size="1" variant="soft" color="red" onClick={handleRepair}>
                Repair
              </Button>
            ) : (
              <Tooltip content="Unable to auto-repair this JSON">
                <Button size="1" variant="soft" color="red" disabled>
                  Repair
                </Button>
              </Tooltip>
            )}
          </Callout.Text>
        </Callout.Root>
      )}

      {queryError && (
        <Callout.Root color="red" size="1">
          <Callout.Icon>
            <CrossCircledIcon />
          </Callout.Icon>
          <Callout.Text>Query error: {queryError}</Callout.Text>
        </Callout.Root>
      )}

      {hasInvalidQuery && (
        <Callout.Root color="red" size="1">
          <Callout.Icon>
            <CrossCircledIcon />
          </Callout.Icon>
          <Callout.Text>Invalid query: path "{query}" does not exist</Callout.Text>
        </Callout.Root>
      )}

      {/* Split view: Left (input) and Right (result) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left panel - JSON Input */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <Text size="2" weight="medium">Input</Text>
            <Button
              variant="outline"
              size="1"
              onClick={() => handleCopy(json)}
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <div
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: 'var(--dracula-border)' }}
          >
            <JsonCodeEditor
              value={json}
              onChange={setJson}
              placeholder="Paste JSON here..."
              height="70vh"
            />
          </div>
        </div>

        {/* Right panel - Result */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <Text size="2" weight="medium">Result</Text>
            {resultDraft && (
              <Button
                variant="outline"
                size="1"
                onClick={() => handleCopy(resultDraft)}
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            )}
          </div>
          <div
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: 'var(--dracula-border)' }}
          >
            {rightContent ? (
              <JsonCodeEditor
                value={resultDraft}
                onChange={setResultDraft}
                height="70vh"
              />
            ) : (
              <div className="p-4">
                <Text size="2" color="gray">
                  {parseError ? 'Fix JSON errors to see result' : 'No result'}
                </Text>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
