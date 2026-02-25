import { useLocation } from 'react-router';

type TLocationState = {
  from?: string;
};

export const useBack = () => {
  const location = useLocation();
  const state = location.state as TLocationState | null;

  const backTo = state?.from ?? '/incidents';

  return { backTo };
};

