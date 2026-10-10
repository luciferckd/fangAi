/**
 * @copyright 2024 FangAI
 * @license MIT
 * @author FangAI
 
 */


/**
 * Node modules
 */

import { useContext } from 'react';


/**
 * Contexxt
 */

import { SnackbarContext} from '../contexts/SnackbarContext.jsx';

export const useSnackbar = () => useContext(SnackbarContext);