import { Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet, useMatches } from 'react-router';

import cls from './root-layout.module.scss';


export interface IMetaHandle {
  title?: (params: Record<string, string | undefined>) => string;
  description?: (params: Record<string, string | undefined>) => string;
}

export const RootLayout = () => {
  const matches = useMatches();

  const lastMatchWithHandle = [...matches].reverse().find((match) => match.handle);
  const metaHandle = (lastMatchWithHandle?.handle ?? {}) as IMetaHandle;
  const routeParams = lastMatchWithHandle?.params ?? {};

  const pageTitle = metaHandle.title ? metaHandle.title(routeParams) : 'Incident Inbox';
  const pageDescription = metaHandle.description?.(routeParams) ?? 'Incident Inbox application.';

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>

      <div className={cls.root}>
        <header className={cls.header}>
          <div className={cls.headerContainer}>
            <div className={cls.brand}>Incident Inbox</div>
            <div className={cls.subtle}>Driver Operations</div>
          </div>
        </header>

        <main className={cls.container}>
          <Suspense fallback={<div>Loading…</div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </>
  );
};
