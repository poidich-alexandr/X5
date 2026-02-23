import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';

export const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>404 — Page Not Found</title>
        <meta
          name="description"
          content="The page you are looking for does not exist."
        />
      </Helmet>

      <div>
        <h1>404</h1>
        <p>The page you are looking for does not exist.</p>

        <Link to="/incidents">
          Back to Incidents
        </Link>
      </div>
    </>
  );
};