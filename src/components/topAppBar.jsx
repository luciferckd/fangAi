/**
 * @copyright 2024 FangAI
 * @license MIT
 * @author FangAI
 */

/**
 * Node Modules
 */
import {
  useNavigation,
  useNavigate,
  useLoaderData,
  useParams,
  useSubmit,
} from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * Custom modules
 */
import logout from '../utils/logout';
import deleteConversation from '../utils/deleteConversation';

/**
 * Custom Hooks
 */
import { useToggle } from '../hooks/useToggle';

/**
 * Components
 */
import { IconBtn } from './button';
import Avatar from './avatar';
import Menu from './Menu';
import MenuItem from './menuItem';
import { LinearProgress } from './progress';
import Logo from './logo';

import { useState } from 'react';
import { useSnackbar } from '../hooks/useSnackbar';
import { getApiKey } from '../lib/googleAi';

const TopAppBar = ({ toggleSidebar }) => {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const { conversation, user } = useLoaderData();
  const params = useParams();
  const submit = useSubmit();
  const [showMenu, setShowMenu] = useToggle();
  const { showSnackbar } = useSnackbar();

  // API Key modal state
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(() => getApiKey() || '');

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    const trimmed = apiKeyInput.trim();
    if (trimmed) {
      localStorage.setItem('gemini_api_key', trimmed);
      showSnackbar({
        message: 'Gemini API key saved successfully!',
        type: 'info',
        timeOut: 3000,
      });
    } else {
      localStorage.removeItem('gemini_api_key');
      showSnackbar({
        message: 'Custom API key cleared. Using default configuration.',
        type: 'info',
        timeOut: 3000,
      });
    }
    setIsKeyModalOpen(false);
  };

  const isNormalLoad = navigation.state === 'loading' && !navigation.formData;

  return (
    <>
      <header className='relative flex justify-between items-center h-16 px-4'>
        <div className='flex items-center gap-1'>
          <IconBtn
            icon='menu'
            title='Menu'
            className='lg:hidden'
            onClick={toggleSidebar}
          />

          <Logo classes='lg:hidden' />
        </div>

        {params.conversationId && (
          <IconBtn
            icon='delete'
            classes='ms-auto me-1 lg:hidden'
            onClick={() => {
              const title =
                conversation?.document?.find(({ $id }) => params.conversationId === $id)
                  ?.title || 'Conversation Deleted';

              deleteConversation({
                id: params.conversationId,
                title,
                submit,
              });
            }}
          />
        )}

        <div className='menu-wrapper relative'>
          <IconBtn
            onClick={setShowMenu}
            title='Account menu'
            classes='shrink-0'
          >
            <Avatar name={user.name} />
          </IconBtn>

          {/* Backdrop to close menu when clicking outside */}
          {showMenu && (
            <div
              className='fixed inset-0 z-20'
              onClick={setShowMenu}
            />
          )}

          <Menu classes={showMenu ? 'active' : ''}>
            {/* User Profile ID Info Header */}
            <div className='flex items-center gap-2.5 px-3 py-2.5 mb-1 border-b border-light-outlineVariant/20 dark:border-dark-outlineVariant/20'>
              <Avatar name={user.name} />
              <div className='min-w-0 flex-1'>
                <p className='text-labelLarge font-semibold text-light-onSurface dark:text-dark-onSurface truncate'>
                  {user.name}
                </p>
                <p className='text-bodySmall text-light-onSurfaceVariant dark:text-dark-onSurfaceVariant truncate'>
                  {user.email || 'FangAI User'}
                </p>
              </div>
            </div>

            <MenuItem
              icon='vpn_key'
              labelText='Gemini API Key'
              onClick={() => {
                setShowMenu();
                setApiKeyInput(getApiKey() || '');
                setIsKeyModalOpen(true);
              }}
            />

            <MenuItem
              icon='logout'
              labelText='Logout'
              classes='text-light-error dark:text-dark-error'
              onClick={() => logout(navigate)}
            />
          </Menu>
        </div>

        <AnimatePresence>
          {isNormalLoad && (
            <LinearProgress classes='absolute top-0 left-0 right-0' />
          )}
        </AnimatePresence>
      </header>

      {/* API Key Modal */}
      {isKeyModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'>
          <div className='w-full max-w-md p-6 rounded-2xl bg-light-surfaceContainerLow dark:bg-dark-surfaceContainerLow border border-light-outlineVariant/30 dark:border-dark-outlineVariant/30 shadow-2xl'>
            <h3 className='text-titleLarge font-semibold text-light-onSurface dark:text-dark-onSurface mb-2'>
              Gemini API Key
            </h3>
            <p className='text-bodyMedium text-light-onSurfaceVariant dark:text-dark-onSurfaceVariant mb-4 leading-relaxed'>
              Enter your Gemini API key from Google AI Studio. Your key is stored securely in your browser's local storage.
            </p>

            <form onSubmit={handleSaveApiKey} className='space-y-4'>
              <input
                type='password'
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder='AIzaSy...'
                className='w-full px-4 py-3 rounded-xl border border-light-outline/40 dark:border-dark-outline/40 bg-light-background dark:bg-dark-background text-light-onBackground dark:text-dark-onBackground focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm'
                autoFocus
              />

              <div className='flex items-center justify-between pt-2'>
                <a
                  href='https://aistudio.google.com/app/apikey'
                  target='_blank'
                  rel='noreferrer'
                  className='text-labelMedium text-teal-600 dark:text-teal-400 hover:underline'
                >
                  Get free API key ↗
                </a>

                <div className='flex gap-2'>
                  <button
                    type='button'
                    onClick={() => setIsKeyModalOpen(false)}
                    className='px-4 py-2 rounded-xl text-labelLarge font-medium text-light-onSurfaceVariant dark:text-dark-onSurfaceVariant hover:bg-light-surfaceContainerHigh dark:hover:bg-dark-surfaceContainerHigh transition'
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className='px-5 py-2 rounded-xl text-labelLarge font-medium bg-teal-500 hover:bg-teal-400 text-slate-950 transition'
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

TopAppBar.propTypes = {
  toggleSidebar: PropTypes.func,
};

export default TopAppBar;
