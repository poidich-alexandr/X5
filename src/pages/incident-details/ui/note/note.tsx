import type { UseMutationResult } from '@tanstack/react-query';

import type { IAddNoteResponse } from '@/shared/api/types/server.types';

import { useIncidentDetailsContext } from '../../model/use-incident-details-context';
import cls from './note.module.scss';

interface INoteProps {
  noteText: string;
  onNoteChange: (note: string) => void;
  onAddNoteSubmit: (event: React.SubmitEvent<HTMLFormElement>) => void;
  addNoteMutation: UseMutationResult<IAddNoteResponse, Error, string, unknown>;
}
export const Note = ({ noteText, onNoteChange, addNoteMutation, onAddNoteSubmit }: INoteProps) => {
  const { data } = useIncidentDetailsContext();

  if (!data) return;

  return (
    <section className={cls.card}>
      <div className={cls.sectionHeader}>
        <h2 className={cls.sectionTitle}>Notes</h2>
        <span className={cls.sectionHint}>
          {data.notes.length ? `${data.notes.length} total` : 'No notes yet'}
        </span>
      </div>

      {data.notes.length ? (
        <ul className={cls.notesList}>
          {data.notes.map((note) => (
            <li className={cls.note} key={note.id}>
              <div className={cls.noteMessage}>{note.message}</div>
              <div className={cls.noteMeta}>{new Date(note.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      ) : (
        <div className={cls.empty}>No notes</div>
      )}

      <form className={cls.form} onSubmit={onAddNoteSubmit}>
        <label className={cls.field}>
          <span className={cls.label}>Add note</span>
          <textarea
            className={cls.textarea}
            aria-label="Add note"
            value={noteText}
            onChange={(event) => onNoteChange(event.target.value)}
            rows={4}
            placeholder="Write a short note for operators…"
            disabled={addNoteMutation.isPending}
          />
        </label>

        <div className={cls.actions}>
          <button
            className={cls.button}
            type="submit"
            disabled={addNoteMutation.isPending || noteText.trim().length === 0}
          >
            Add note
          </button>

          {addNoteMutation.isError && <div className={cls.inlineError}>Failed to add note</div>}
        </div>
      </form>
    </section>
  );
};
