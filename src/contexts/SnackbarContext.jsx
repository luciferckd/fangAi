/**
 * @copyright 2024 FangAI
 * @license MIT
 * @author FangAI
 */

/**
 * Node Modules
 */
import { createContext, useState, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * Components
 */
import Snackbar from '../components/snackbar';

export const SnackbarContext = createContext({
  snackbar: {
    open: false,
    message: '',
    type: 'info',
  },
  showSnackbar: () => {},
  hideSnackbar: () => {},
});

const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    type: 'info',
  });

  const timeoutRef = useRef();

  const showSnackbar = useCallback(({ message, type = 'info', timeOut = 5000 }) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setSnackbar({ open: true, message, type });

    timeoutRef.current = setTimeout(() => {
      setSnackbar((prev) => ({ ...prev, open: false }));
    }, timeOut);
  }, []);

  const hideSnackbar = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setSnackbar({ open: false, message: '', type: 'info' });
  }, []);

  const contextValue = useMemo(() => {
    return { snackbar, showSnackbar, hideSnackbar };
  }, [snackbar, showSnackbar, hideSnackbar]);

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      <Snackbar snackbar={snackbar} />
    </SnackbarContext.Provider>
  );
};

SnackbarProvider.propTypes = {
  children: PropTypes.node,
};

export default SnackbarProvider;
