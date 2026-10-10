/**
 * @copyright 2024 FangAI
 * @license MIT
 * @author FangAI
 */

/**
 * Node modules
 */
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { hopscotch, coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState, useEffect, useCallback } from 'react';

/**
 * Custom modules
 */
import toTitleCase from '../utils/toTitleCase';

/**
 * Custom hooks
 */
import { useSnackbar } from '../hooks/useSnackbar';


/**
 * Components
 */
import { IconBtn } from './button';

/**
 * Assets
 */
import { iconLogo } from '../assets/assets';

const AiResponse = ({ aiResponse, children }) => {
  // Initialize the codeTheme state to an empty string, this will be used to store the selected code theme using the function
  const [codeTheme, setCodeTheme] = useState('');

  const { showSnackbar, hideSnackbar} = useSnackbar();

  // useEffect to set the codeTheme based on the user's system preference color scheme
  useEffect(() => {
    // Create a media query to detect the user's preference color scheme
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Function to update the codeTheme state based on the media query
    setCodeTheme(mediaQuery.matches ? hopscotch : coy);

    // Add an event listener to the media query to update the codeTheme state when the preference changes
    const themeListener = mediaQuery.addEventListener('change', (event) => {
      setCodeTheme(event.matches ? hopscotch : coy);
    });

    // Cleanup function to remove the event listener when the component unmounts
    return () => mediaQuery.removeEventListener('change', themeListener);
  }, []);

  const handleCopy = useCallback(async (text) => {
    hideSnackbar();
    try {
      await navigator.clipboard.writeText(text);
      showSnackbar({
        message: 'Code copied to clipboard',
        timeOut: 2500,
      })
    } catch (err) {
      showSnackbar({message: err.message})
      console.error(`Error copying text: ${err.message}`);
    }
  }, [showSnackbar, hideSnackbar]);

  // This function will execute for every code tag
  const code = ({ children, className, ...rest }) => {
    const match = className?.match(/language-(\w+)/);

    return match ? (
      <>
        <div className='code-block'>
          <div className='p-4 pb-0 font-sans'>{toTitleCase(match[1])}</div>

          <SyntaxHighlighter
            {...rest}
            PreTag='div'
            language={match[1]}
            style={codeTheme}
            customStyle={{
              marginBlock: '0',
              padding: '2px',
            }}
            codeTagProps={{
              style: {
                padding: '14px',
                fontWeight: '600',
              },
            }}
          >
            {children}
          </SyntaxHighlighter>
        </div>

        <div className='bg-light-surfaceContainer dark:bg-dark-surfaceContainer rounded-t-extraSmall rounded-b-medium  flex justify-between items-center h-11 font-sans text-bodyMedium ps-4 pe-2'>
          <p>
            Use code
            <a
              className='link ms-2'
              href='https://gemini.google.com/faq#coding'
              target='_blank'
            >
              with caution.
            </a>
          </p>

          <IconBtn
            icon='content_copy'
            size='small'
            title='Copy code'
            onClick={handleCopy.bind(null, children)}
          />
        </div>
      </>
    ) : (
      <code className={className}>{children}</code>
    );
  };

  return (
    <div className='flex justify-start items-start gap-3 py-4 md:gap-4'>
      <figure className='w-8 h-8 shrink-0 grid place-items-center mt-1'>
        <img
          src={iconLogo}
          width={32}
          height={32}
          alt='FangAI Logo'
        />
      </figure>

      <div className='grow min-w-0'>
        {children}

        {aiResponse ? (
          <div className='markdown-content'>
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{ code }}
            >
              {aiResponse}
            </Markdown>
          </div>
        ) : !children ? (
          <div className='text-bodyMedium text-light-error dark:text-dark-error py-2'>
            ⚠️ No response received. Please check your Gemini API connection.
          </div>
        ) : null}
      </div>
    </div>
  );
};

AiResponse.propTypes = {
  aiResponse: PropTypes.string,
  children: PropTypes.any,
};

export default AiResponse;
