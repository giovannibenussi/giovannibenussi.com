import { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Popover, Switch, Text } from '@radix-ui/themes';
import { GearIcon } from '@radix-ui/react-icons';
import { JsonEditor, type JsonEditorHandle } from './JsonEditor';
import { DiffViewer } from './DiffViewer';
import { useJsonDiff } from '../../hooks/useJsonDiff';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { AddedIcon, RemovedIcon, ModifiedIcon } from '../DiffIcons';

const SAMPLE_LEFT = `{
  "name": "John",
  "age": 30,
  "city": "New York"
}`;

const SAMPLE_RIGHT = `{
  "name": "Jane",
  "age": 30,
  "country": "USA"
}`;

const STORAGE_KEYS = {
  settings: 'json-compare-settings',
  leftJson: 'json-compare-left',
  rightJson: 'json-compare-right',
};


interface Settings {
  showIndividualFormat: boolean;
  formatOnPaste: boolean;
  hideHighlightsWhileEditing: boolean;
  persistData: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  showIndividualFormat: false,
  formatOnPaste: false,
  hideHighlightsWhileEditing: true,
  persistData: true,
};

export function JsonCompare() {
  // Load settings from localStorage
  const [settings, setSettings] = useLocalStorage<Settings>(STORAGE_KEYS.settings, DEFAULT_SETTINGS);

  // Initialize JSON state - load from localStorage only if persistData is enabled
  const [leftJson, setLeftJson] = useState(() => {
    if (settings.persistData) {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.leftJson);
        if (stored !== null) {
          return stored;
        }
      } catch {
        // Ignore
      }
    }
    return SAMPLE_LEFT;
  });

  const [rightJson, setRightJson] = useState(() => {
    if (settings.persistData) {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.rightJson);
        if (stored !== null) {
          return stored;
        }
      } catch {
        // Ignore
      }
    }
    return SAMPLE_RIGHT;
  });

  // Save JSON data to localStorage when it changes (if persistData is enabled)
  useEffect(() => {
    if (settings.persistData) {
      try {
        localStorage.setItem(STORAGE_KEYS.leftJson, leftJson);
      } catch {
        // Ignore storage errors
      }
    }
  }, [leftJson, settings.persistData]);

  useEffect(() => {
    if (settings.persistData) {
      try {
        localStorage.setItem(STORAGE_KEYS.rightJson, rightJson);
      } catch {
        // Ignore storage errors
      }
    }
  }, [rightJson, settings.persistData]);

  // Clear stored JSON data when persistData is disabled
  useEffect(() => {
    if (!settings.persistData) {
      try {
        localStorage.removeItem(STORAGE_KEYS.leftJson);
        localStorage.removeItem(STORAGE_KEYS.rightJson);
      } catch {
        // Ignore
      }
    }
  }, [settings.persistData]);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Sync scroll state
  const [syncScroll, setSyncScroll] = useState(true);
  const leftEditorRef = useRef<JsonEditorHandle>(null);
  const rightEditorRef = useRef<JsonEditorHandle>(null);
  const isScrollingRef = useRef(false);
  const lastScrollPositionRef = useRef(0);

  const handleLeftScroll = useCallback((scrollTop: number) => {
    lastScrollPositionRef.current = scrollTop;
    if (!syncScroll || isScrollingRef.current) return;
    isScrollingRef.current = true;
    rightEditorRef.current?.scrollTo(scrollTop);
    requestAnimationFrame(() => {
      isScrollingRef.current = false;
    });
  }, [syncScroll]);

  const handleRightScroll = useCallback((scrollTop: number) => {
    lastScrollPositionRef.current = scrollTop;
    if (!syncScroll || isScrollingRef.current) return;
    isScrollingRef.current = true;
    leftEditorRef.current?.scrollTo(scrollTop);
    requestAnimationFrame(() => {
      isScrollingRef.current = false;
    });
  }, [syncScroll]);

  const handleSyncScrollChange = useCallback((checked: boolean) => {
    setSyncScroll(checked);
    if (checked) {
      // Sync both editors to the last scrolled position
      const position = lastScrollPositionRef.current;
      leftEditorRef.current?.scrollTo(position);
      rightEditorRef.current?.scrollTo(position);
    } else {
      // Scroll both to the top
      leftEditorRef.current?.scrollTo(0);
      rightEditorRef.current?.scrollTo(0);
    }
  }, []);

  const handleDiffClick = useCallback((leftLine: number | null, rightLine: number | null) => {
    if (leftLine) {
      leftEditorRef.current?.scrollToLine(leftLine);
    }
    if (rightLine) {
      rightEditorRef.current?.scrollToLine(rightLine);
    }
  }, []);

  const { leftResult, rightResult, diffResult, isLeftEditing, isRightEditing } = useJsonDiff(leftJson, rightJson);
  const diffs = diffResult?.diffs || [];

  const handleFormatBoth = () => {
    if (leftResult.success && leftResult.data !== undefined) {
      setLeftJson(JSON.stringify(leftResult.data, null, 2));
    }
    if (rightResult.success && rightResult.data !== undefined) {
      setRightJson(JSON.stringify(rightResult.data, null, 2));
    }
  };

  const canFormatBoth = leftResult.success || rightResult.success;

  // Determine if highlights should be hidden based on editing state
  const isEditing = isLeftEditing || isRightEditing;
  const shouldHideHighlights = settings.hideHighlightsWhileEditing && isEditing;

  return (
    <div className="flex flex-col gap-4 p-6 h-full">
      <div className="flex justify-between items-center flex-wrap gap-2 shrink-0">
        <div className="flex gap-4 items-center text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <ModifiedIcon className="size-3.5 text-amber-500 dark:text-amber-400" />
            Modified
          </span>
          <span className="flex items-center gap-1.5">
            <AddedIcon className="size-3.5 text-emerald-500 dark:text-emerald-400" />
            Added
          </span>
          <span className="flex items-center gap-1.5">
            <RemovedIcon className="size-3.5 text-rose-500 dark:text-rose-400" />
            Removed
          </span>
        </div>

        <div className="flex gap-3 items-center">
          {!settings.showIndividualFormat && (
            <Button
              variant="soft"
              size="1"
              onClick={handleFormatBoth}
              disabled={!canFormatBoth}
            >
              Format
            </Button>
          )}

          <Popover.Root>
            <Popover.Trigger>
              <Button variant="soft" size="1">
                <GearIcon />
              </Button>
            </Popover.Trigger>
            <Popover.Content width="280px">
              <div className="flex flex-col gap-3">
                <Text size="2" weight="bold" color="purple">
                  Settings
                </Text>

                <Text as="label" size="2">
                  <div className="flex justify-between items-center gap-4">
                    <span>Sync scroll</span>
                    <Switch
                      checked={syncScroll}
                      onCheckedChange={(checked) => handleSyncScrollChange(checked)}
                    />
                  </div>
                </Text>

                <Text as="label" size="2">
                  <div className="flex justify-between items-center gap-4">
                    <span>Show individual format buttons</span>
                    <Switch
                      checked={settings.showIndividualFormat}
                      onCheckedChange={(checked) => updateSetting('showIndividualFormat', checked)}
                    />
                  </div>
                </Text>

                <Text as="label" size="2">
                  <div className="flex justify-between items-center gap-4">
                    <span>Format on paste</span>
                    <Switch
                      checked={settings.formatOnPaste}
                      onCheckedChange={(checked) => updateSetting('formatOnPaste', checked)}
                    />
                  </div>
                </Text>

                <Text as="label" size="2">
                  <div className="flex justify-between items-center gap-4">
                    <span>Hide highlights while editing</span>
                    <Switch
                      checked={settings.hideHighlightsWhileEditing}
                      onCheckedChange={(checked) => updateSetting('hideHighlightsWhileEditing', checked)}
                    />
                  </div>
                </Text>

                <div className="border-t border-[var(--dracula-border)] pt-3">
                  <Text as="label" size="2">
                    <div className="flex justify-between items-center gap-4">
                      <span>Remember JSON data</span>
                      <Switch
                        checked={settings.persistData}
                        onCheckedChange={(checked) => updateSetting('persistData', checked)}
                      />
                    </div>
                  </Text>
                </div>
              </div>
            </Popover.Content>
          </Popover.Root>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
        <JsonEditor
          ref={leftEditorRef}
          label="Left JSON"
          value={leftJson}
          onChange={setLeftJson}
          parseResult={leftResult}
          diffs={shouldHideHighlights ? [] : diffs}
          side="left"
          showFormatButton={settings.showIndividualFormat}
          formatOnPaste={settings.formatOnPaste}
          onScroll={handleLeftScroll}
        />
        <JsonEditor
          ref={rightEditorRef}
          label="Right JSON"
          value={rightJson}
          onChange={setRightJson}
          parseResult={rightResult}
          diffs={shouldHideHighlights ? [] : diffs}
          side="right"
          showFormatButton={settings.showIndividualFormat}
          formatOnPaste={settings.formatOnPaste}
          onScroll={handleRightScroll}
        />
      </div>

      <div className="shrink-0 max-h-[30vh] overflow-auto">
        <DiffViewer
          diffResult={shouldHideHighlights ? null : diffResult}
          leftValid={leftResult.success}
          rightValid={rightResult.success}
          leftJson={leftJson}
          rightJson={rightJson}
          onDiffClick={handleDiffClick}
        />
      </div>
    </div>
  );
}
