import { useMemo, useState } from 'react';
import { Button, Callout, SegmentedControl, Tabs, Text } from '@radix-ui/themes';
import { CheckIcon, CopyIcon, CrossCircledIcon } from '@radix-ui/react-icons';

type Direction = 'encode' | 'decode';
type Mode = 'base64' | 'url' | 'html';

// --- Base64 ---
const base64Encode = (input: string) => {
  const bytes = new TextEncoder().encode(input);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
};
const base64Decode = (input: string) => {
  const bin = atob(input);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder('utf-8').decode(bytes);
};

// --- URL ---
const urlEncode = (input: string) => encodeURIComponent(input);
const urlDecode = (input: string) => decodeURIComponent(input);

// --- HTML entities ---
const htmlEncode = (input: string) =>
  input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const htmlDecode = (input: string) => {
  const doc = new DOMParser().parseFromString(input, 'text/html');
  return doc.documentElement.textContent ?? '';
};

const runners: Record<Mode, Record<Direction, (input: string) => string>> = {
  base64: { encode: base64Encode, decode: base64Decode },
  url: { encode: urlEncode, decode: urlDecode },
  html: { encode: htmlEncode, decode: htmlDecode },
};

const labels: Record<Mode, string> = {
  base64: 'Base64',
  url: 'URL',
  html: 'HTML entities',
};

const placeholders: Record<Mode, Record<Direction, string>> = {
  base64: {
    encode: 'Plain text to encode...',
    decode: 'Base64 string to decode...',
  },
  url: {
    encode: 'Text with spaces, &, =, etc...',
    decode: 'Percent-encoded string...',
  },
  html: {
    encode: '<script>alert("hi")</script>',
    decode: '&lt;script&gt;alert(&quot;hi&quot;)&lt;/script&gt;',
  },
};

interface PaneProps {
  mode: Mode;
}

function Pane({ mode }: PaneProps) {
  const [direction, setDirection] = useState<Direction>('encode');
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const { output, error } = useMemo(() => {
    if (!input) return { output: '', error: null as string | null };
    try {
      return { output: runners[mode][direction](input), error: null };
    } catch (e) {
      return {
        output: '',
        error: e instanceof Error ? e.message : 'Conversion failed',
      };
    }
  }, [mode, direction, input]);

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SegmentedControl.Root
          value={direction}
          onValueChange={(v) => setDirection(v as Direction)}
          size="2"
        >
          <SegmentedControl.Item value="encode">Encode</SegmentedControl.Item>
          <SegmentedControl.Item value="decode">Decode</SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Text size="2" weight="medium">
            Input
          </Text>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholders[mode][direction]}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            data-gramm="false"
            data-gramm_editor="false"
            data-enable-grammarly="false"
            rows={10}
            className="w-full resize-none rounded-xl border border-slate-200 bg-white p-4 font-mono text-sm leading-6 break-all whitespace-pre-wrap outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Text size="2" weight="medium">
              Output
            </Text>
            {output && (
              <Button variant="outline" size="1" onClick={handleCopy}>
                {copied ? <CheckIcon /> : <CopyIcon />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            )}
          </div>
          {error ? (
            <Callout.Root color="red" size="1">
              <Callout.Icon>
                <CrossCircledIcon />
              </Callout.Icon>
              <Callout.Text>{error}</Callout.Text>
            </Callout.Root>
          ) : (
            <textarea
              value={output}
              readOnly
              placeholder={input ? '' : 'Output will appear here...'}
              spellCheck={false}
              rows={10}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm leading-6 break-all whitespace-pre-wrap outline-none dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-100"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export function EncoderDecoder() {
  const [mode, setMode] = useState<Mode>('base64');

  return (
    <div className="flex flex-col gap-6 p-6">
      <Tabs.Root value={mode} onValueChange={(v) => setMode(v as Mode)}>
        <Tabs.List>
          {(Object.keys(labels) as Mode[]).map((m) => (
            <Tabs.Trigger key={m} value={m}>
              {labels[m]}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <div className="mt-5">
          {(Object.keys(labels) as Mode[]).map((m) => (
            <Tabs.Content key={m} value={m}>
              <Pane mode={m} />
            </Tabs.Content>
          ))}
        </div>
      </Tabs.Root>
    </div>
  );
}
