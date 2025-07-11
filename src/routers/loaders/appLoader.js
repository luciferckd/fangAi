/**
 * @copyright 2024 FangAI
 * @license MIT
 * @author FangAI
 
 */

/**
 * Node modules
 */
import { redirect } from 'react-router-dom';
import { Query } from 'appwrite';

/**
 * Custom modules
 */
import { account, databases } from '../../lib/appwrite';

const appLoader = async () => {
  const data = {};
  try {
    // Attempt to retrieve the user's accoount information
    data.user = await account.get();
  } catch (err) {
    console.log(`Error in appLoader:, ${err.message}`);
    return redirect('/login');
  }

  try {
    data.conversation = await databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      'conversation',
      [
        Query.select(['$id', 'title']),
        Query.orderDesc('$createdAt'),
        Query.equal('user_id', data.user.$id),
      ],
    );
  } catch (err) {
    console.log(`Error getting conversations: ${err.message}`);
  }

  return data;
};

export default appLoader;
