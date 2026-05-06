import { useMemo, useState } from 'react';
import { Button, Callout, Text } from '@radix-ui/themes';
import { CopyIcon, CheckIcon, CrossCircledIcon } from '@radix-ui/react-icons';
import { JsonCodeEditor } from '../../json/components/JsonCodeEditor';

const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzEwMDAwMDAwLCJleHAiOjE3NDE1MzYwMDB9.3c7EJjqVh7tKZqCYJlEsw_AU0L9VWLQxMqE-SxGxQLM';

function base64UrlDecode(input: string): string {
  // JWT uses base64url: -/_ instead of +// and no padding.
  const pad = input.length % 4 === 0 ? '' : '='.repeat(4 - (input.length % 4));
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/') + pad;
  const binary = atob(base64);
  // Decode as UTF-8
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder('utf-8').decode(bytes);
}

interface DecodedPart {
  raw: string;
  pretty: string;
  error?: string;
}

interface DecodedJwt {
  header: DecodedPart;
  payload: DecodedPart;
  signature: string;
}

function decodeJwt(token: string): { ok: true; value: DecodedJwt } | { ok: false; error: string } {
  let trimmed = token.trim();
  if (!trimmed) return { ok: false, error: 'Empty input' };

  // Accept "Bearer <token>" copy-pastes from Authorization headers.
  if (/^bearer\s+/i.test(trimmed)) {
    trimmed = trimmed.replace(/^bearer\s+/i, '');
  }

  const parts = trimmed.split('.');
  if (parts.length !== 3) {
    return { ok: false, error: `Expected 3 segments separated by ".", got ${parts.length}` };
  }

  const decodePart = (part: string): DecodedPart => {
    try {
      const raw = base64UrlDecode(part);
      try {
        const parsed = JSON.parse(raw);
        return { raw, pretty: JSON.stringify(parsed, null, 2) };
      } catch (e) {
        return {
          raw,
          pretty: raw,
          error: e instanceof Error ? e.message : 'Invalid JSON',
        };
      }
    } catch (e) {
      return {
        raw: '',
        pretty: '',
        error: e instanceof Error ? e.message : 'Invalid base64url',
      };
    }
  };

  return {
    ok: true,
    value: {
      header: decodePart(parts[0]),
      payload: decodePart(parts[1]),
      signature: parts[2],
    },
  };
}

function formatTimestamp(seconds: unknown): string | null {
  if (typeof seconds !== 'number' || !Number.isFinite(seconds)) return null;
  const date = new Date(seconds * 1000);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'long' });
}

function relativeFromNow(seconds: unknown): string | null {
  if (typeof seconds !== 'number' || !Number.isFinite(seconds)) return null;
  const nowMs = Date.now();
  const thenMs = seconds * 1000;
  const diffMs = thenMs - nowMs;
  const abs = Math.abs(diffMs);
  const min = 60 * 1000;
  const hr = 60 * min;
  const day = 24 * hr;

  const fmt = (n: number, unit: string) => {
    const rounded = Math.round(n);
    return `${rounded} ${unit}${rounded === 1 ? '' : 's'}`;
  };

  let text: string;
  if (abs < min) text = 'less than a minute';
  else if (abs < hr) text = fmt(abs / min, 'minute');
  else if (abs < day) text = fmt(abs / hr, 'hour');
  else text = fmt(abs / day, 'day');

  return diffMs >= 0 ? `in ${text}` : `${text} ago`;
}

interface Claim {
  key: string;
  label: string;
  value: string;
  hint?: string;
  tone?: 'default' | 'warning' | 'danger';
}

function extractTimestampClaims(payload: DecodedPart): Claim[] {
  if (payload.error || !payload.pretty) return [];
  try {
    const parsed = JSON.parse(payload.pretty) as Record<string, unknown>;
    const claims: Claim[] = [];
    const timeKeys: { key: string; label: string }[] = [
      { key: 'iat', label: 'Issued at' },
      { key: 'nbf', label: 'Not before' },
      { key: 'exp', label: 'Expires' },
    ];
    for (const { key, label } of timeKeys) {
      if (key in parsed) {
        const formatted = formatTimestamp(parsed[key]);
        const relative = relativeFromNow(parsed[key]);
        if (formatted) {
          let tone: Claim['tone'] = 'default';
          if (key === 'exp' && typeof parsed[key] === 'number') {
            const thenMs = (parsed[key] as number) * 1000;
            if (thenMs < Date.now()) tone = 'danger';
            else if (thenMs - Date.now() < 24 * 60 * 60 * 1000) tone = 'warning';
          }
          claims.push({
            key,
            label,
            value: formatted,
            hint: relative ?? undefined,
            tone,
          });
        }
      }
    }
    return claims;
  } catch {
    return [];
  }
}

export function JwtDecoder() {
  const [token, setToken] = useState(SAMPLE_JWT);
  const [copiedHeader, setCopiedHeader] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);

  const result = useMemo(() => decodeJwt(token), [token]);
  const claims = useMemo(
    () => (result.ok ? extractTimestampClaims(result.value.payload) : []),
    [result],
  );

  const copy = async (text: string, which: 'header' | 'payload') => {
    try {
      await navigator.clipboard.writeText(text);
      if (which === 'header') {
        setCopiedHeader(true);
        setTimeout(() => setCopiedHeader(false), 1800);
      } else {
        setCopiedPayload(true);
        setTimeout(() => setCopiedPayload(false), 1800);
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex flex-col gap-2">
        <Text size="2" weight="medium">
          Token
        </Text>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste JWT here..."
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          data-gramm="false"
          data-gramm_editor="false"
          data-enable-grammarly="false"
          rows={4}
          className="w-full resize-none rounded-xl border border-slate-200 bg-white p-4 font-mono text-sm leading-6 break-all whitespace-pre-wrap outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-indigo-500"
        />
      </div>

      {!result.ok && (
        <Callout.Root color="red" size="1">
          <Callout.Icon>
            <CrossCircledIcon />
          </Callout.Icon>
          <Callout.Text>{result.error}</Callout.Text>
        </Callout.Root>
      )}

      {result.ok && (
        <>
          {claims.length > 0 && (
            <div className="flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/60">
              {claims.map((c) => (
                <div key={c.key} className="flex flex-col gap-0.5">
                  <span className="font-mono text-[10px] tracking-wider text-slate-500 uppercase dark:text-slate-400">
                    {c.label} ({c.key})
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      c.tone === 'danger'
                        ? 'text-rose-600 dark:text-rose-400'
                        : c.tone === 'warning'
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {c.value}
                  </span>
                  {c.hint && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">{c.hint}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Text size="2" weight="medium">
                  Header
                </Text>
                <Button
                  variant="outline"
                  size="1"
                  onClick={() => copy(result.value.header.pretty, 'header')}
                >
                  {copiedHeader ? <CheckIcon /> : <CopyIcon />}
                  {copiedHeader ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              {result.value.header.error ? (
                <Callout.Root color="red" size="1">
                  <Callout.Icon>
                    <CrossCircledIcon />
                  </Callout.Icon>
                  <Callout.Text>{result.value.header.error}</Callout.Text>
                </Callout.Root>
              ) : (
                <div
                  className="rounded-xl border overflow-hidden"
                  style={{ borderColor: 'var(--dracula-border)' }}
                >
                  <JsonCodeEditor
                    value={result.value.header.pretty}
                    onChange={() => {
                      /* read-only */
                    }}
                    readOnly
                    height="240px"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Text size="2" weight="medium">
                  Payload
                </Text>
                <Button
                  variant="outline"
                  size="1"
                  onClick={() => copy(result.value.payload.pretty, 'payload')}
                >
                  {copiedPayload ? <CheckIcon /> : <CopyIcon />}
                  {copiedPayload ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              {result.value.payload.error ? (
                <Callout.Root color="red" size="1">
                  <Callout.Icon>
                    <CrossCircledIcon />
                  </Callout.Icon>
                  <Callout.Text>{result.value.payload.error}</Callout.Text>
                </Callout.Root>
              ) : (
                <div
                  className="rounded-xl border overflow-hidden"
                  style={{ borderColor: 'var(--dracula-border)' }}
                >
                  <JsonCodeEditor
                    value={result.value.payload.pretty}
                    onChange={() => {
                      /* read-only */
                    }}
                    readOnly
                    height="240px"
                  />
                </div>
              )}
            </div>
          </div>

        </>
      )}
    </div>
  );
}
