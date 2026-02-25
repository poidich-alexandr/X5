import type { UseMutationResult } from '@tanstack/react-query';
import { useState } from 'react';

import type { IAddNoteResponse } from '@/shared/api/types/server.types';

export const useNote = (
  incidentId: string,
  addNoteMutation: UseMutationResult<IAddNoteResponse, Error, string, unknown>
) => {
  const noteStorageKey = `incident-note-draft-${incidentId}`;
  const getInitialNote = () => {
    if (!incidentId) return '';
    return localStorage.getItem(noteStorageKey) ?? '';
  };
  const [noteText, setNoteText] = useState(() => getInitialNote());

  const handleAddNoteSubmit: React.SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const trimmedNoteText = noteText.trim();
    if (trimmedNoteText.length === 0) {
      return;
    }
    addNoteMutation.mutate(trimmedNoteText);
  };

  return { noteText, setNoteText, noteStorageKey, handleAddNoteSubmit };
};
