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

const topAppBar = ({ toggleSidebar }) => {
  const navigation = useNavigation();

  // usenavigate: Function for programmatically navigating between routes
  const navigate = useNavigate();

  /**
   * - converstions: Array containing all conversations data.
   * -user: User data for the currently logged-in user
   */

  const { conversation, user } = useLoaderData();

  // useParams: Function to access URL parameters
  const params = useParams();

  /**
   * Obtain the useSubmit hook for handling form submissions:
   * - submit: Function to submit a form programmatically
   * - formData: Form data associated with the current navigation
   */
  const submit = useSubmit();

  /**
   * use a custom hooks to toggle the menu show state
   * 'showMenu' is the current state of the menu
   * and 'setShowMenu' is the function to set toggle the sidebar
   */
  const [showMenu, setShowMenu] = useToggle();

  const isNormalLoad = navigation.state === 'loading' && !navigation.formData;

  return (
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
            // Find the curent conversation title
             const title = conversation?.document?.find(({ $id }) => params.conversationId === $id)?.title || 'Conversation Deleted';

            // Call the deleteConversation function
            deleteConversation({
              id: params.conversationId,
              title,
              submit
            })
          }}
        />
      )}

      <div className='menu-wrapper'>
        <IconBtn onClick={setShowMenu}>
          <Avatar name={user.name} />
        </IconBtn>

        <Menu classes={showMenu ? 'active' : ''}>
          <MenuItem
            labelText='Logout'
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
  );
};

topAppBar.PropTypes = {
  toggleSidebar: PropTypes.func,
};

export default topAppBar;
