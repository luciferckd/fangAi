/**
 * @copyright 2024 FangAI
 * @license MIT
 * @author FangAI
 */

/**
 * Custom Modules
 */
import { account } from "../lib/appwrite";


/**
 * logs out the current user from the app and navigates to the deleting their session and 
 * navigates to the login page
 * 
 * @param {Function} navigate 
 * @returns 
 * Logout the user from the app
 * @async
 * @function logout
 * @param {Function} navigate - The function to navigate to a different page
 * @throws {Error} Throws an error if the logout fails
 * @returns {Promise} A promise that resolves when the user is logged out
 * @description This function deletes the current user session and navigates to the home page.
 * @example
 * logout(navigate)
 * session, the error will be logged to the console.
 */

const logout = async (navigate) => {
    try {
        await account.deleteSession('current');
    } catch (err) {
        console.log(`Error deleting user session: ${err.
            message}`);
    }
    return navigate('/login')
}

export default logout;