import { Link } from 'react-router';

import { Dropdown } from '@/shared/ui/dropdown/dropdown';
import { getInitialDropdownOption } from '@/shared/utils/get-initial-dropdown-options';

import cls from './incident-details.page.module.scss';
import { priorityDetailOptions, statusDetailOptions } from './model/consts/incidents.consts';
import { isIncidentPriorityDTO, isIncidentStatusDTO } from './model/guards';
import { IncidentDetailsProvider } from './model/incident-details-provider';
import { useBack } from './model/use-back';
import { useDetailsMutation } from './model/use-details-mutation';
import { useIncidentDetailsContext } from './model/use-incident-details-context';
import { useNote } from './model/use-note';
import { useNoteDraftStorage } from './model/use-note-draft-storage';
import { Note } from './ui/note/note';

export const IncidentDetailsContent = () => {
  const { data, incidentId, paramId, isError, error, isLoading } = useIncidentDetailsContext();
  const { backTo } = useBack();

  const { updateStatusMutation, updatePriorityMutation, addNoteMutation } = useDetailsMutation({
    incidentId,
    onAddNoteSuccess: () => {
      setNoteText('');
      clearDraft();
    },
  });
  const { noteText, setNoteText, noteStorageKey, handleAddNoteSubmit } = useNote(
    incidentId,
    addNoteMutation
  );
  const { clearDraft } = useNoteDraftStorage({ incidentId, noteStorageKey, noteText });

  const handleStatusChange = (value: string) => {
    if (!isIncidentStatusDTO(value)) return;
    updateStatusMutation.mutate(value);
  };

  const handlePriorityChange = (value: string) => {
    if (!isIncidentPriorityDTO(value)) return;
    updatePriorityMutation.mutate(value);
  };

  const isNotFound = isError && error instanceof Error && error.message === 'NOT_FOUND';

  if (!paramId) return <div>Not found</div>;
  if (isNotFound) return <div>Not found</div>;
  if (isError) return <div>Something went wrong</div>;
  if (isLoading) return <div>Loading details…</div>;
  if (!data) return <div>Something went wrong</div>;

  return (
    <div className={cls.page}>
      <Link className={cls.backLink} to={backTo}>
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

            <Note
              noteText={noteText}
              onAddNoteSubmit={handleAddNoteSubmit}
              addNoteMutation={addNoteMutation}
              onNoteChange={(note) => setNoteText(note)}
            />
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

export const IncidentDetailsPage = () => {
  return (
    <IncidentDetailsProvider>
      <IncidentDetailsContent />
    </IncidentDetailsProvider>
  );
};
