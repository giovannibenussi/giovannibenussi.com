import { useMemo } from 'react';
import { useDebounce } from './useDebounce';
import { parseJson, computeDiff } from '../utils/jsonDiff';
import type { DiffResult, JsonParseResult } from '../utils/types';

interface UseJsonDiffResult {
  leftResult: JsonParseResult;
  rightResult: JsonParseResult;
  diffResult: DiffResult | null;
  isLeftEditing: boolean;
  isRightEditing: boolean;
}

export function useJsonDiff(leftInput: string, rightInput: string): UseJsonDiffResult {
  const debouncedLeft = useDebounce(leftInput, 300);
  const debouncedRight = useDebounce(rightInput, 300);

  const leftResult = useMemo(() => parseJson(debouncedLeft), [debouncedLeft]);
  const rightResult = useMemo(() => parseJson(debouncedRight), [debouncedRight]);

  const diffResult = useMemo(() => {
    if (!leftResult.success || !rightResult.success) {
      return null;
    }
    return computeDiff(leftResult.data, rightResult.data);
  }, [leftResult, rightResult]);

  // Check if user is currently editing (value differs from debounced)
  const isLeftEditing = leftInput !== debouncedLeft;
  const isRightEditing = rightInput !== debouncedRight;

  return {
    leftResult,
    rightResult,
    diffResult,
    isLeftEditing,
    isRightEditing,
  };
}
