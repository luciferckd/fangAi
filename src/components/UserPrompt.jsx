/**
 * @copyright 2024 FangAI
 * @license MIT
 * @author FangAI
 */

/**
 * Node modules
 */
import PropTypes from 'prop-types';
import { useLoaderData } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';

/**
 * Custom modules
 */
import { useToggle } from '../hooks/useToggle';

/**
 * Components
 */
import Avatar from './Avatar';
import { IconBtn } from './button';


const UserPrompt = ({ text }) => {
  // Retrieve the user data from the loader using the useLoaderData hook.
  const { user } = useLoaderData();

  // Use the useToggle hook to manage the state of the user prompt text.
  const [isExpanded, toggleExpand] = useToggle();

  // Create a ref to access the text box element in the DOM.
  const textBoxRef = useRef();

  // Initialize the hasMoreContent state, indicating whether the content exceeds the visible height of the text box.
  const [hasMoreContent, setMoreContent] = useState(false);

  /**
   * Use useEffect to update the hasmorecontent state whenever the text box ref changes.
   * This ensures that the state is updated correctly if the text box content changes.
   */
  useEffect(() => {
    setMoreContent(
      textBoxRef.current.scrollHeight > textBoxRef.current.clientHeight,
    )
  }, [textBoxRef])


  
  return (
    <div className='flex justify-end items-start gap-3 py-4'>
      <div className='flex flex-col items-end max-w-[85%] md:max-w-[75%]'>
        <div className='bg-light-surfaceContainerHigh dark:bg-dark-surfaceContainerHigh text-light-onSurface dark:text-dark-onSurface px-4 py-3 rounded-2xl rounded-tr-extraSmall shadow-sm'>
          <p
            className={`text-bodyLarge whitespace-pre-wrap ${
              !isExpanded ? 'line-clamp-4' : ''
            }`}
            ref={textBoxRef}
          >
            {text}
          </p>
        </div>

        {hasMoreContent && (
          <div className='mt-1'>
            <IconBtn
              icon={isExpanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
              onClick={toggleExpand}
              title={isExpanded ? 'Collapse text' : 'Expand text'}
              size='small'
            />
          </div>
        )}
      </div>

      <Avatar name={user?.name} />
    </div>
  );
};

UserPrompt.propTypes = {
  text: PropTypes.string,
};

export default UserPrompt;
