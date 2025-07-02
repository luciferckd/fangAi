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

const resetPasswordLoader = async ({ request }) => {
    const url = new URL(request.url);
  try {
    await account.get();

    
  return redirect('/');
  } catch (error) {
    console.log(`Error: ${error}`

    );
  }

  if (!url.searchParams.get('userId') && !url.searchParams.get('secret')) {
    return redirect('/reset-link');
  }

    return null;

};

export default resetPasswordLoader;
