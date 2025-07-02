/**
 * @copyright 2024 FangAI
 * @license MIT
 * @author FangAI
 */

/**
 * Node modules
 */
import { redirect } from 'react-router-dom';

/**
 * Custom modules
 */
import { account, databases } from '../../lib/appwrite';

const conversationLoader = async ({ params }) => {
  const { conversationId } = params;
  const data = {};

  try {
    // Attempt to retrieve the user's account information
    data.user = await account.get();
  } catch (err) {
    console.log(`Error getting user account: ${err.message}`);
    // If there's an error getting the user, log it and redirect to the login page.
    return redirect('/login');
  }

  try {
    // Attempt to fetch the conversation docunment from the Appwrite database.
    data.conversation = await databases.getDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      'conversation',
      conversationId,
    );
  } catch (err) {
    console.log(`Error getting conversation: ${err.message}`);
    throw err; // Re-throw the error so it can be handled by the error boundary or a suitable component.
  }

  //Return the data object containing user and conversation information

  return data;
};

export default conversationLoader;
