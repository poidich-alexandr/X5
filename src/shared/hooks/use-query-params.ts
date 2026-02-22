import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';

// import type {
//   TIncidentPriorityParam,
//   TIncidentSortParam,
//   TIncidentStatusParam,
// } from '../api/types/client.types';

export type TSearchParams = {
  query?: string;
  status?: TIncidentStatusParam;
  priority?: TIncidentPriorityParam;
  sort?: TIncidentSortParam;
  page?: string;
  limit?: string;
};

export type TIncidentPriorityParam = 'low' | 'medium' | 'high';
export type TIncidentStatusParam = 'new' | 'in_progress' | 'resolved';
export type TIncidentSortParam = 'newest' | 'oldest';

export const useQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const setParams = useCallback(
    (params: TSearchParams, searchParams?: URLSearchParams) => {
      const newParams = new URLSearchParams(searchParams);

      Object.entries(params).forEach(([key, value]) => {
        if (isValidParamValue(value)) {
          newParams.set(key, String(value));
        } else {
          newParams.delete(key);
        }
      });

      setSearchParams(newParams);

      return Object.fromEntries(newParams) as unknown as TSearchParams;
    },
    [setSearchParams]
  );

  const updateParams = useCallback(
    (params: TSearchParams): TSearchParams => setParams(params, searchParams),
    [searchParams, setParams]
  );

  const clearParams = useCallback(() => {
    const newParams = new URLSearchParams();
    setSearchParams(newParams);
  }, [setSearchParams]);

  const deleteParam = (param: keyof TSearchParams) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(param); // удаляем параметр "foo"
    setSearchParams(newParams);
    return Object.fromEntries(newParams) as Omit<TSearchParams, typeof param>;
  };

  const params = useMemo(() => {
    return Object.fromEntries(searchParams.entries()) as unknown as TSearchParams;
  }, [searchParams]);

  return {
    params,
    setParams,
    clearParams,
    updateParams,
    deleteParam,
  };
};

const isValidParamValue = (value: unknown): boolean => {
  if (value == undefined) return false;

  if (Array.isArray(value)) {
    return value.length > 0 && value.every(isValidParamValue);
  }

  if (typeof value === 'number') {
    return value !== 0 && !Number.isNaN(value);
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  return false;
};
