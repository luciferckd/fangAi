/**
 * @copyright 2024 FangAI
 * @license MIT
 * @author FangAI
 */

/**
 *  Node Modules
 */

import { redirect } from 'react-router-dom';


/**
 *   Custom Modules
 */

import { account } from "../../lib/appwrite";
import generateID from "../../utils/generateID";

/**
 * Handles the registration of a new user.
 */

const registerAction = async ({ request }) => {
    // retrieve the form data from the incoming request
    const formData = await request.formData();
    
    try {

        await account.create(
            generateID(), // user ID
            formData.get('email'), // email
            formData.get('password'), // password
            formData.get('name'), // name
        )

    } catch (error) {
        // handle error here
        return {
            error: true,
            message: error.message,
        }
    }

    // After successful account create, login the user and redirect to home page

    try {

        await account.createEmailPasswordSession(
            formData.get('email'), // email
            formData.get('password'), // password
        )
        
    } catch (error) {

        console.log(`Error creating email session: ${error.message}`);
        return redirect('/login')
    }


    return redirect('/');
}


export default registerAction ;