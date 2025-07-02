/**
 * @copyright 2024 FangAI
 * @license MIT
 * @author FangAI
 */

/**
 * Node modules
 */
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Outlet, useParams, useNavigation, useActionData } from 'react-router-dom';

/**
 * Custom hooks
 */
import { useToggle } from './hooks/useToggle';
import { useSnackbar } from './hooks/useSnackbar';
import { usePromptPreloader } from './hooks/userPromptPreloader';

/**
 * Components
 */
import PageTitle from './components/pageTitle';
import TopAppBar from './components/topAppBar';
import Sidebar from './components/sidebar';
import Greetings from './pages/Greetings';
import PromptField from './components/promptField';
import { use } from 'react';

const App = () => {
  // Get the URL parameters
  const params = useParams()

  // Access the navigation state.
  const navigation = useNavigation()

  // Get the data passed from a form action.
  const actionData = useActionData()

  /**
   * create a rference to an HTML element,
   * likely used to interact with the chat history
   */
  const chatHistoryRef = useRef()

  /**
   * Use a custom hooms to manage the sidebar open state. is using
   * isSidebarOpen holds the current state, and toggleSidebar is a 
   * function to toggle the sidebar.
   */
  const [isSidebarOpen,  toggleSidebar] = useToggle()

  /**
   * Access the prompt preloader state,
   * paticularly the value for prompt preloading
   */
  const { promptPreloaderValue } = usePromptPreloader()

  const { showSnackbar } = useSnackbar()

  useEffect(() => {
    const chatHistory = chatHistoryRef.current
    if (promptPreloaderValue) {
      chatHistory.scroll({
        top: chatHistory.scrollHeight - chatHistory.clientHeight,
        behavior: 'smooth',
      })
    }
  }, [chatHistoryRef, promptPreloaderValue])

  // Show a snackbar after deleted the conversation
  useEffect(() => {
    if (actionData?.conversationTitle) {
      showSnackbar({
        message: `Conversation "${actionData.conversationTitle}" deleted`,
      })
    }
  }, [actionData, showSnackbar]);

  const isNormalLoad = navigation.state === 'loading' && !navigation.formData

  return (
    <>
      {/* Meta title */}
      <PageTitle title='FangAI- chat to supercharge your ideas' />

      <div className='lg:grid lg:grid-cols-[320px,1fr]'>
        {/* Sidebar */}
        <Sidebar 
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        />

        

        <div className='h-dvd grid grid-rows-[max-content,minmax(0,1fr),max-content]'>
          {/* Top app bar */}
          <TopAppBar toggleSidebar={toggleSidebar} />

          {/* Main content */}
          <div ref={chatHistoryRef} className='px-5 pb-5 flex flex-col overflow-y-auto'>
            <div className='max-w-[840px] w-full mx-auto grow'>
              {isNormalLoad ? null : params.conversationId ? (
                <Outlet />
              ): (
                <Greetings />
              )}
            </div>
          </div>

          {/* Prompt field */}
          <div className="bg-light-background dark:bg-dark-background">
            <div className="max-w-[870px] px-5 w-full mx-auto">
              <PromptField />



              <motion.p 
              initial={{ opacity: 0, translateY: '-4px'}}
              animate={{ opacity: 1, translateY: 0}}
              transition={{ duration: 0.2, delay: 0.8, ease: 'easeOut'}}
              className='text-bodySmall text-center text-light-onSurfaceVariant
              dark:text-dark-onSurfaceVariant p-3'>
                FangAI may display inaccurate info,
                including about people, so
                double-check its responses.
                <a  href='https://support.google.com/' target='_blank' 
                className='inline underline ms-1 text-teal-500'
                >
                  Your privacy & Gemini Apps
                </a>

              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
