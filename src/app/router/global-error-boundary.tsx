import { isRouteErrorResponse, Link, useRouteError } from 'react-router';

import cls from './global-error-boundary.module.scss';

export const GlobalErrorBoundary = () => {
  const routeError = useRouteError();

  let title = 'Something went wrong';
  let description = 'Please try again.';
  let debugMessage: string | null = null;

  if (isRouteErrorResponse(routeError)) {
    title = `${routeError.status} ${routeError.statusText}`;
    description =
      typeof routeError.data === 'string' ? routeError.data : 'An unexpected error occurred.';
  } else if (routeError instanceof Error) {
    debugMessage = routeError.message;
  }

  return (
    <div className={cls.page}>
      <div className={cls.card}>
        <h1 className={cls.title}>{title}</h1>
        <p className={cls.text}>{description}</p>

        {debugMessage ? <pre className={cls.debug}>{debugMessage}</pre> : null}

        <div className={cls.actions}>
          <button className={cls.button} type="button" onClick={() => window.location.reload()}>
            Reload
          </button>

          <Link className={cls.link} to="/incidents">
            Go to incidents
          </Link>
        </div>
      </div>
    </div>
  );
};