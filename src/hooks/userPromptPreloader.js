/**
 * @copyright 2024 FangAI
 * @license MIT
 * @author FangAI
 */

/**
 * Node modules
 */
import { useEffect, useState } from 'react';
import { useNavigation } from 'react-router-dom';

/**
 * 
 */

const usePromptPreloader = () => {

    // Get navigation state
    const navigation = useNavigation();

    // Initialize preloader value
    const [promptPreloaderValue, setpromptPreloaderValue] = useState('');

     // use useeffect to update preloader vvlue based on navigation.formdata
    useEffect(() => {
        // If form data is exists, get the user prompt and update the preloader value.
        if (navigation.formData) {
            setpromptPreloaderValue(navigation.formData.get('user_prompt'));
        } else {
            // If form data is not exists, set the preloader value to empty string.
            setpromptPreloaderValue('');
        }
    }, [navigation]) // Run effect when navigation changes
    // Return the preloader value
    return { promptPreloaderValue };
}

export {usePromptPreloader}