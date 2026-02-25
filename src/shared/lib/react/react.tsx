import { type Context, createContext, useContext } from 'react';

export const createAppContext = <T,>() => {
  return createContext<T | null>(null);
};

export const useAppContext = <T,>(context: Context<T | null>) => {
  const value = useContext(context);
  if (value === null) {
    throw new Error('Have no context or using another pages ContextProvider');
  }
  return value as T;
};
