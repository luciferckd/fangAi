/**
 * @copyright 2024 FangAI
 * @license MIT
 * @author FangAI
 */



import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

/**
 * custom Module
 */

import router from './routers/routes.jsx'

/**
 *  Components
 */

import SnackbarProvider from './contexts/SnackbarContext.jsx'

/**
 * CSS Link
 */
import './index.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SnackbarProvider>
   <RouterProvider router={router} /> 
    </SnackbarProvider>
  </StrictMode>,
)
