/**
 * @copyright 2024 FangAI
 * @license MIT
 * @author FangAI
 */

/**
 * Node modules
 */
import { useRouteError, Link, useNavigation } from 'react-router-dom';

/**
 * Components
 */
import { LinearProgress } from '../components/progress';

const RootError = () => {
  const error = useRouteError();
  const navigation = useNavigation();

  const status = error?.status || 404;
  const message =
    error?.statusText || error?.message || "We couldn't find the page you were looking for.";

  return (
    <>
      <div className='h-dvh grid grid-cols-1 justify-items-center content-center text-center px-4'>
        <p className='text-displayLarge'>{error.status}</p>
        <p className='text-light-onSurfaceVariant dark:text-dark-onSurfaceVariant mt-1 mb-4'>
          {message}
        </p>

        <Link className='btn filled primary' to='/'>
          Back to home
          <div className='state-layer'></div>
        </Link>
      </div>

      {navigation.state === 'loading' && (
        <LinearProgress classes='fixed top-0 left-0 right-0' />
      )}
    </>
  );
};

export default RootError;
