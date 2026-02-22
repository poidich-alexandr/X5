import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';

import { api } from '@/shared/api';
import type { IIncidentsListResponse } from '@/shared/api/types/server.types';
import { useQueryParams } from '@/shared/hooks/use-query-params';
import { Dropdown } from '@/shared/ui/dropdown/dropdown';
import { debounce } from '@/shared/utils/debounce';
import { getInitialDropdownOption } from '@/shared/utils/get-initial-dropdown-options';
import { parsePositiveInteger } from '@/shared/utils/parse-positive-integer';

import { priorityOptions, sortOptions, statusOptions } from './model/consts/incidents.consts';
import cls from './incidents.page.module.scss';
import { isPriorityType, isSortType, isStatusType } from './model/guards';
import { Pagination } from './ui/pagination';

export const IncidentsPage = () => {
  const { params, updateParams } = useQueryParams();
  const [queryInputValue, setQueryInputValue] = useState(params.query || '');

  const query = params.query;
  const status = params.status;
  const priority = params.priority;
  const sort = params.sort ?? 'newest';
  const page = parsePositiveInteger(params.page, '1');
  const limit = parsePositiveInteger(params.limit, '10');

  const incidentsQueryParameters = {
    query,
    status,
    priority,
    sort,
    page,
    limit,
  };

  const { data, isLoading, isError } = useQuery<IIncidentsListResponse | undefined>({
    queryKey: ['incidents', incidentsQueryParameters],
    queryFn: ({ signal }) => api.getIncidents(incidentsQueryParameters, { signal }),
  });

  const debouncedUpdateParams = useMemo(
    () =>
      debounce((value: string) => {
        updateParams({
          query: value,
          page: '1', // при изменении фильтров/поиска сбрасыва страницу
        });
      }, 400),
    [updateParams]
  );

  const handleQueryChange = (value: string) => {
    setQueryInputValue(value);
    debouncedUpdateParams(value);
  };

  const handleStatusChange = (value: string) => {
    if (isStatusType(value)) {
      updateParams({
        status: value === 'allStatus' ? undefined : value,
        page: '1',
      });
    }
  };

  const handlePriorityChange = (value: string) => {
    if (isPriorityType(value)) {
      updateParams({
        priority: value === 'allPriorities' ? undefined : value,
        page: '1',
      });
    }
  };

  const handleSortChange = (value: string) => {
    if (isSortType(value)) {
      updateParams({
        sort: value || 'newest',
        page: '1',
      });
    }
  };

  const handlePrevPagination = () => {
    if (!data) return;
    updateParams({
      page: String(data.page - 1),
    });
  };
  const handleNextPagination = () => {
    if (!data) return;
    updateParams({
      page: String(data.page + 1),
    });
  };

  //синхронизация input с Back/Next history
  useEffect(() => {
    const queryFromUrl = params.query || '';
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQueryInputValue(queryFromUrl);
  }, [params.query]);

  if (isError) {
    return <div>Failed to load incidents</div>;
  }

  return (
    <div className={cls.page}>
      <h1 className={cls.title}>Incidents</h1>

      <div className={cls.toolbar}>
        <label className={cls.field}>
          <span className={cls.label}>Search</span>
          <input
            className={cls.input}
            value={queryInputValue}
            onChange={(event) => handleQueryChange(event.target.value)}
            placeholder="Search by title/description/id"
          />
        </label>

        <label className={cls.field}>
          <span className={cls.label}>Status</span>
          <Dropdown
            items={statusOptions}
            initialOption={getInitialDropdownOption(statusOptions, params.status)}
            ariaLabel="status dropdown trigger"
            onChange={(option) => handleStatusChange(option.value)}
          />
        </label>

        <label className={cls.field}>
          <span className={cls.label}>Priority</span>
          <Dropdown
            items={priorityOptions}
            // initialOption={priorityOptions[0]}
            initialOption={getInitialDropdownOption(priorityOptions, params.priority)}
            ariaLabel="priority dropdown trigger"
            onChange={(option) => handlePriorityChange(option.value)}
          />
        </label>

        <label className={cls.field}>
          <span className={cls.label}>Sort</span>
          <Dropdown
            items={sortOptions}
            initialOption={getInitialDropdownOption(sortOptions, params.sort)}
            ariaLabel="sort dropdown trigger"
            onChange={(option) => handleSortChange(option.value)}
          />
        </label>
      </div>

      <div className={cls.content}>
        {isLoading || !data ? (
          <div className={cls.state}>Loading…</div>
        ) : data.items.length === 0 ? (
          <div className={cls.state}>No incidents found</div>
        ) : (
          <ul className={cls.list}>
            {data.items.map((incident) => (
              <li className={cls.listItem} key={incident.id}>
                <Link className={cls.link} to={`/incidents/${incident.id}`}>
                  {incident.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {!isLoading && data && data.totalPages > 1 && (
        <div className={cls.footer}>
          <Pagination
            data={data}
            onPrevPagination={handlePrevPagination}
            onNextPagination={handleNextPagination}
          />
        </div>
      )}
    </div>
  );
};
