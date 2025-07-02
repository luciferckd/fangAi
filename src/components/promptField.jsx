/**
 * @copyright 2024 FangAI
 * @license MIT
 * @author FangAI
 */

/**
 * Component
 */
import { IconBtn } from './button';

/**
 *  Node Modules
 */
import { motion } from 'framer-motion';
import { useRef, useCallback, useState } from 'react';
import { useNavigation, useSubmit, useParams } from 'react-router-dom';

const promptField = () => {
  // 'inputfield' and 'inputfieldcontainter' hold references to their DOM elements
  const inputField = useRef();
  const inputFieldContainer = useRef();

  // manmade from submission
  const submit = useSubmit();

  // initial navigation for checking state
  const navigation = useNavigation();

  // Get the params from the URL  
  const { conversationId } = useParams();
  
  

  // State for input field
  const [placeholderShown, setPlaceholderShown] = useState(true);
  const [isMultiline, setMultiline] = useState(false);
  const [inputValue, setInputValue] = useState('');

  //Handle input field input change
  const handleInputChange = useCallback(() => {
    if (inputField.current.innerText === '\n')
      inputField.current.innerHTML = '';
    setPlaceholderShown(!inputField.current.innerText);
    setMultiline(inputFieldContainer.current.clientHeight > 64);
    setInputValue(inputField.current.innerText.trim());
  }, []);

  // Move cursor to the end after paste text in input field
  const moveCursorToEnd = useCallback(() => {
    const editableElem = inputField.current;
    const range = document.createRange();
    const selection = window.getSelection();

    // set the range to the last chid f the editable element
    range.selectNodeContents(editableElem);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }, []);

  // Handle paste text
  const handlePaste = useCallback(
    (e) => {
      e.preventDefault();
      inputField.current.innerText += e.clipboardData.getData('text');
      handleInputChange();
      moveCursorToEnd();
    },
    [handleInputChange, moveCursorToEnd],
  );

  // Handle submit
  const handleSubmit = useCallback(() => {
    // prevent submission if the inpiut is empty or form submission is ongoing
    if (!inputValue || navigation.state === 'submitting') return;

    submit(
      {
        user_prompt: inputValue,
        request_type: 'user_prompt',
      },
      {
        method: 'POST',
        encType: 'application/x-www-form-urlencoded',
        action: `/${conversationId || ''}`,
      },
    );

    inputField.current.innerHTML = '';
    handleInputChange();
  }, [handleInputChange, inputValue, navigation.state, submit, conversationId]);

  // Define a framer motion variant fot the prompt feild, controlling its animation based on its visibility state.
  const promptFieldVariant = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.2,
        duration: 0.4,
        delay: 0.4,
        ease: [0.05, 0.7, 0.1, 1],
      },
    },
  };

  // Define a Framer Motion variant for the prompt field childern, controlling its animation based on its visibility state.
  const promptFieldChildernVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <motion.div
      className={`prompt-field-container ${isMultiline ? 'rounded-large' : ''}`}
      variants={promptFieldVariant}
      initial='hidden'
      animate='visible'
      ref={inputFieldContainer}
    >
      <motion.div
        className={`prompt-field ${placeholderShown ? '' : 'after:hidden'}`}
        contentEditable={true}
        role='textbox'
        aria-multiline={true}
        aria-label='Enter a Prompt here'
        data-placeholder='Enter Your Prompt'
        variants={promptFieldChildernVariant}
        ref={inputField}
        onInput={handleInputChange}
        onPaste={handlePaste}
        onKeyDown={(e) => {
          // Handle case are user press only Enter key
          if (e.key === 'Enter' && !e.shiftKey) {
            // submit input
            e.preventDefault();
            handleSubmit();
          }
        }}
      />

      <IconBtn
        icon='send'
        title='Submit'
        size='large'
        classes='ms-auto'
        variants={promptFieldChildernVariant}
        onClick={handleSubmit}
      />

      <div className='state-layer'></div>
    </motion.div>
  );
};

export default promptField;
