import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useParams } from 'react-router';

import { api } from '@/shared/api';
import type { IIncidentDetailsResponse } from '@/shared/api/types/server.types';
import { Dropdown } from '@/shared/ui/dropdown/dropdown';
import { getInitialDropdownOption } from '@/shared/utils/get-initial-dropdown-options';

import cls from './incident-details.page.module.scss';
import { priorityDetailOptions, statusDetailOptions } from './model/consts/incidents.consts';
import { isIncidentPriorityDTO, isIncidentStatusDTO } from './model/guards';
import { useNoteDraftStorage } from './model/use-note-draft-storage';
import { useDetailsMutation } from './model/useDetailsMutation';

export const IncidentDetailsPage = () => {
  const { id: paramId } = useParams();
  const incidentId = paramId ?? '';
  const noteStorageKey = `incident-note-draft-${incidentId}`;

  const getInitialNote = () => {
    if (!incidentId) return '';
    return localStorage.getItem(noteStorageKey) ?? '';
  };
  const [noteText, setNoteText] = useState(() => getInitialNote());

  const incidentDetailsQueryKey = ['incident', incidentId] as const;

  const { data, isLoading, isError, error } = useQuery<IIncidentDetailsResponse>({
    queryKey: incidentDetailsQueryKey,
    queryFn: ({ signal }) => api.getIncidentDetails(incidentId, { signal }),
    enabled: Boolean(incidentId),
  });

  const { clearDraft } = useNoteDraftStorage({ incidentId, noteStorageKey, noteText });
  const { updateStatusMutation, updatePriorityMutation, addNoteMutation } = useDetailsMutation({
    incidentId,
    onAddNoteSuccess: () => {
      setNoteText('');
      clearDraft();
    },
  });

  const handleStatusChange = (value: string) => {
    if (!isIncidentStatusDTO(value)) return;
    updateStatusMutation.mutate(value);
  };

  const handlePriorityChange = (value: string) => {
    if (!isIncidentPriorityDTO(value)) return;
    updatePriorityMutation.mutate(value);
  };

  const handleAddNoteSubmit: React.SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const trimmedNoteText = noteText.trim();
    if (trimmedNoteText.length === 0) {
      return;
    }
    addNoteMutation.mutate(trimmedNoteText);
  };

  const isNotFound = isError && error instanceof Error && error.message === 'NOT_FOUND';

  if (!paramId) return <div>Not found</div>;
  if (isNotFound) return <div>Not found</div>;
  if (isError) return <div>Something went wrong</div>;
  if (isLoading) return <div>Loading details…</div>;
  if (!data) return <div>Something went wrong</div>;

  return (
    <div className={cls.page}>
      <Link className={cls.backLink} to="/incidents">
        ← Back to incidents
      </Link>
      <div className={cls.shell}>
        <div className={cls.head}>
          <h1 className={cls.title}>{data.incident.title}</h1>

          <div className={cls.meta}>
            <div className={cls.metaItem}>
              <span className={cls.metaKey}>ID</span>
              <span className={cls.metaValue}>{data.incident.id}</span>
            </div>
            <div className={cls.metaItem}>
              <span className={cls.metaKey}>Reporter</span>
              <span className={cls.metaValue}>{data.incident.reporter}</span>
            </div>
            <div className={cls.metaItem}>
              <span className={cls.metaKey}>Created</span>
              <span className={cls.metaValue}>
                {new Date(data.incident.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className={cls.layout}>
          <main className={cls.main}>
            <section className={cls.card}>
              <h2 className={cls.sectionTitle}>Description</h2>
              <p className={cls.description}>{data.incident.description}</p>
            </section>

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
                      <div className={cls.noteMeta}>
                        {new Date(note.createdAt).toLocaleString()}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={cls.empty}>No notes</div>
              )}

              <form className={cls.form} onSubmit={handleAddNoteSubmit}>
                <label className={cls.field}>
                  <span className={cls.label}>Add note</span>
                  <textarea
                    className={cls.textarea}
                    aria-label="Add note"
                    value={noteText}
                    onChange={(event) => setNoteText(event.target.value)}
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

                  {addNoteMutation.isError && (
                    <div className={cls.inlineError}>Failed to add note</div>
                  )}
                </div>
              </form>
            </section>
          </main>

          <aside className={cls.aside}>
            <div className={cls.triageCard}>
              <div className={cls.triageHeader}>
                <h2 className={cls.sectionTitle}>Triage</h2>
                <div className={cls.triageSub}>Set current status and priority</div>
              </div>

              <div className={cls.triageGrid}>
                <div className={cls.field}>
                  <span className={cls.label}>Status</span>
                  <div className={cls.control}>
                    <Dropdown
                      clsRoot={cls.rootDropdown}
                      items={statusDetailOptions}
                      initialOption={getInitialDropdownOption(
                        statusDetailOptions,
                        data.incident.status
                      )}
                      ariaLabel="status dropdown trigger"
                      isDisabled={updateStatusMutation.isPending}
                      onChange={(option) => handleStatusChange(option.value)}
                    />
                  </div>
                  {updateStatusMutation.isError && (
                    <div className={cls.inlineError}>Failed to update status</div>
                  )}
                </div>

                <div className={cls.field}>
                  <span className={cls.label}>Priority</span>
                  <div className={cls.control}>
                    <Dropdown
                      clsRoot={cls.rootDropdown}
                      clsDropdown={cls.priorityDropdownList}
                      items={priorityDetailOptions}
                      initialOption={getInitialDropdownOption(
                        priorityDetailOptions,
                        data.incident.priority
                      )}
                      ariaLabel="priority dropdown trigger"
                      isDisabled={updatePriorityMutation.isPending}
                      onChange={(option) => handlePriorityChange(option.value)}
                    />
                  </div>
                  {updatePriorityMutation.isError && (
                    <div className={cls.inlineError}>Failed to update priority</div>
                  )}
                </div>
              </div>

              <div className={cls.triageFooter}>
                <div className={cls.hint}>
                  Changes are saved automatically. If network fails, we rollback.
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
