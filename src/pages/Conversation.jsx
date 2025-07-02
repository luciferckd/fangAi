/**
 * @copyright 2024 FangAI
 * @license MIT
 * @author FangAI
 */

/**
 * Custom Hooks
 */
import { usePromptPreloader } from '../hooks/userPromptPreloader';

/**
 * Node modules
 */
import { motion } from 'framer-motion';
import { useLoaderData, useLocation } from 'react-router-dom';

/**
 * Components
 */
import PageTitle from '../components/pageTitle';
import UserPrompt from '../components/UserPrompt';
import AiResponse from '../components/AiResponse';
import PromptPreloader from '../components/PromptPreloader';

const Conversation = () => {
  const {
    conversation: { title, chats },
  } = useLoaderData() || {};

  // Retrieve the user prompt preloader value using the custom hooks 

  const { promptPreloaderValue } = usePromptPreloader();

  // Obtain the current Url location information using the useLocation hook
  const location = useLocation();

  return (
    <>
      {/* Meta title */}
      <PageTitle title={`${title} | Fang`} />

      <motion.div
        className='max-w-[700px] mx-auto !will-change-auto'
        initial={!location.state?._isRedirect && { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.05, ease: 'easeOut' }}
      >
        {chats.map((chat) => (
          <div key={chat.$id}>
            {/* UserPrompt */}
            <UserPrompt text={chat.user_prompt} />

            {/* AiResponse */}
            <AiResponse aiResponse={chat.ai_response} />
          </div>
        ))}
      </motion.div>

      {/* Preloader */}
      { promptPreloaderValue && (
          <PromptPreloader promptValue={promptPreloaderValue} />
      )}


      
    
    </>
  );
};

export default Conversation;
