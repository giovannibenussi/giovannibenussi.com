import type { DiffItem } from './types';

export interface LineHighlight {
  lineNumber: number;
  kind: 'added' | 'removed' | 'modified';
}

/**
 * Finds the line number in a formatted JSON string that contains a given path.
 * Returns -1 if not found.
 */
function findLineForPath(formattedJson: string, path: string[]): number {
  if (path.length === 0) return -1;

  const lines = formattedJson.split('\n');
  const targetKey = path[path.length - 1];

  // Build a regex to find the key at the correct nesting level
  // We look for "key": pattern
  const keyPattern = new RegExp(`^\\s*"${escapeRegex(targetKey)}"\\s*:`);

  // Track array state as we traverse
  let inArray = false;
  let arrayIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Track array indices
    if (line === '[' || line.endsWith('[')) {
      inArray = true;
      arrayIndex = 0;
    } else if (line === ']' || line === '],' || line.startsWith(']')) {
      inArray = false;
    }

    // Check if this line matches the target path
    if (keyPattern.test(lines[i])) {
      // Verify we're at the right depth by checking indentation
      const indent = lines[i].match(/^(\s*)/)?.[1].length || 0;
      const expectedDepth = path.length - 1;
      const actualDepth = Math.floor(indent / 2); // Assuming 2-space indent

      if (actualDepth === expectedDepth) {
        // Additional check: verify parent path matches
        if (verifyPath(lines, i, path)) {
          return i;
        }
      }
    }

    // For array items, check numeric indices
    if (inArray && !isNaN(Number(targetKey))) {
      const targetIndex = Number(targetKey);
      if (line.startsWith('{') || line.startsWith('"') || line.match(/^[\d\-\[{]/)) {
        if (arrayIndex === targetIndex) {
          // Verify this is at the right path
          if (verifyArrayPath(lines, i, path)) {
            return i;
          }
        }
        if (!line.includes('[')) {
          arrayIndex++;
        }
      }
    }
  }

  return -1;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Verify that the path up to this line matches the expected path
 */
function verifyPath(lines: string[], lineIndex: number, path: string[]): boolean {
  if (path.length <= 1) return true;

  // Walk backwards to find parent keys
  const currentIndent = lines[lineIndex].match(/^(\s*)/)?.[1].length || 0;
  let parentPath: string[] = [];

  for (let i = lineIndex - 1; i >= 0; i--) {
    const line = lines[i];
    const indent = line.match(/^(\s*)/)?.[1].length || 0;

    if (indent < currentIndent) {
      const keyMatch = line.match(/^\s*"([^"]+)"\s*:/);
      if (keyMatch) {
        parentPath.unshift(keyMatch[1]);
        if (parentPath.length === path.length - 1) {
          break;
        }
      }
    }
  }

  // Check if parent path matches
  const expectedParent = path.slice(0, -1);
  return parentPath.length === expectedParent.length &&
    parentPath.every((key, i) => key === expectedParent[i]);
}

function verifyArrayPath(_lines: string[], _lineIndex: number, _path: string[]): boolean {
  // Simplified verification for array paths
  return true;
}

/**
 * Given formatted JSON and diff items, compute which lines should be highlighted
 */
export function computeLineHighlights(
  formattedJson: string,
  diffs: DiffItem[],
  side: 'left' | 'right'
): LineHighlight[] {
  const highlights: LineHighlight[] = [];

  for (const diff of diffs) {
    // Skip items that don't apply to this side
    if (side === 'left' && diff.kind === 'added') continue;
    if (side === 'right' && diff.kind === 'removed') continue;

    const lineNumber = findLineForPath(formattedJson, diff.path);
    if (lineNumber >= 0) {
      highlights.push({
        lineNumber,
        kind: diff.kind === 'unchanged' ? 'modified' : diff.kind,
      });
    }
  }

  return highlights;
}

/**
 * Simple approach: find lines containing the path key and mark them
 */
export function computeLineHighlightsSimple(
  formattedJson: string,
  diffs: DiffItem[],
  side: 'left' | 'right'
): Map<number, 'added' | 'removed' | 'modified'> {
  const highlights = new Map<number, 'added' | 'removed' | 'modified'>();
  const lines = formattedJson.split('\n');

  for (const diff of diffs) {
    // Skip items that don't apply to this side
    if (side === 'left' && diff.kind === 'added') continue;
    if (side === 'right' && diff.kind === 'removed') continue;

    if (diff.path.length === 0) continue;

    const targetKey = diff.path[diff.path.length - 1];
    const keyPattern = new RegExp(`"${escapeRegex(targetKey)}"\\s*:`);

    // Find all lines that match this key
    for (let i = 0; i < lines.length; i++) {
      if (keyPattern.test(lines[i])) {
        // Use a simple heuristic: check if indentation roughly matches path depth
        const indent = lines[i].match(/^(\s*)/)?.[1].length || 0;
        const expectedMinIndent = (diff.path.length - 1) * 2;

        if (indent >= expectedMinIndent && indent <= expectedMinIndent + 4) {
          const kind = diff.kind === 'unchanged' ? 'modified' : diff.kind;
          highlights.set(i, kind);
        }
      }
    }
  }

  return highlights;
}

/**
 * Find line number for a specific path in JSON
 */
export function findLineNumberForPath(
  formattedJson: string,
  path: string[]
): number {
  if (path.length === 0) return -1;

  const lines = formattedJson.split('\n');
  const targetKey = path[path.length - 1];
  const keyPattern = new RegExp(`"${escapeRegex(targetKey)}"\\s*:`);

  for (let i = 0; i < lines.length; i++) {
    if (keyPattern.test(lines[i])) {
      const indent = lines[i].match(/^(\s*)/)?.[1].length || 0;
      const expectedMinIndent = (path.length - 1) * 2;

      if (indent >= expectedMinIndent && indent <= expectedMinIndent + 4) {
        return i + 1; // Return 1-indexed line number
      }
    }
  }

  return -1;
}

export interface DiffWithLines extends DiffItem {
  leftLine: number | null;
  rightLine: number | null;
}

/**
 * Compute line numbers for all diffs
 */
export function computeDiffLineNumbers(
  leftJson: string,
  rightJson: string,
  diffs: DiffItem[]
): DiffWithLines[] {
  return diffs.map(diff => {
    let leftLine: number | null = null;
    let rightLine: number | null = null;

    if (diff.kind !== 'added') {
      leftLine = findLineNumberForPath(leftJson, diff.path);
      if (leftLine === -1) leftLine = null;
    }

    if (diff.kind !== 'removed') {
      rightLine = findLineNumberForPath(rightJson, diff.path);
      if (rightLine === -1) rightLine = null;
    }

    return {
      ...diff,
      leftLine,
      rightLine,
    };
  });
}
