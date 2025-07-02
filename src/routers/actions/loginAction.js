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
import { account } from '../../lib/appwrite';

/**
 *  handle the login Actions
 */

const loginAction = async ({ request }) => {
  // retierve the form data from incoming request

  const formData = await request.formData();
  try {
    await account.createEmailPasswordSession(
      formData.get('email'),
      formData.get('password'),
    );

    return redirect('/');
  } catch (err) {
    return { message: err.message };
  }
};

export default loginAction;
