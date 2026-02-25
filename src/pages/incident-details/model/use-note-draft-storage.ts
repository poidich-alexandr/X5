import { useEffect, useMemo } from 'react';

import { debounce } from '@/shared/utils/debounce';

export const saveNoteToStorage = (storageKey: string, value: string) => {
  if (value.trim().length === 0) {
    localStorage.removeItem(storageKey);
  } else {
    localStorage.setItem(storageKey, value);
  }
};

interface IUseNoteDraftStorageParams {
  incidentId?: string | null;
  noteStorageKey: string;
  noteText: string;
  delay?: number;
}

export const useNoteDraftStorage = ({
  incidentId,
  noteStorageKey,
  noteText,
  delay = 700,
}: IUseNoteDraftStorageParams) => {

  const debouncedSaveDraft = useMemo(() => {
    return debounce((value: string) => {
      if (!noteStorageKey) return;
      saveNoteToStorage(noteStorageKey, value);
    }, delay);
  }, [noteStorageKey, delay]);

  useEffect(() => {
    if (!incidentId) return;
    
    debouncedSaveDraft(noteText);
  }, [noteText, debouncedSaveDraft, incidentId]);

  const clearDraft = () => {
    if (!noteStorageKey) return;
    localStorage.removeItem(noteStorageKey);
  };

  const getDraft = () => {
    if (!noteStorageKey) return '';
    return localStorage.getItem(noteStorageKey) ?? '';
  };

  return {
    clearDraft,
    getDraft,
  };
};
