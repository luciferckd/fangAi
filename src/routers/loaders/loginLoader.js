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
 * custom modules
 */
import { account } from '../../lib/appwrite';

const loginLoader = async ({ request }) => {
  try {
    await account.get();
  } catch (error) {
    console.log(`Error: ${error}`);
    return null;
  }

  return redirect('/');
};

export default loginLoader;
