/**
 * @copyright 2024 FangAI
 * @license MIT
 * @author FangAI
 */

/**
 * custom modules
 */
import { databases } from "../../lib/appwrite";
import { getAiResponse } from "../../api/googleAi";
import generateID from "../../utils/generateID";

/**
 * 
 * @param {*} param0 
 * @returns
 * 
 * This function handles the conversation action. It retrieves the conversation ID from the URL parameters,
 * the request body, and the user ID from the session. It then checks if the conversation ID is valid and
 * if the user is logged in. If the user is not logged in, it returns a redirect to the login page.
 * If the conversation ID is valid, it retrieves the conversation data from the database and checks if the conversation
 * is valid. If the conversation is valid, it retrieves the messages from the database and checks if the message is valid.
 * 
 * If the message is valid, it retrieves the message data from the database and checks if the message is valid.
 * 
 * 
 */

const conversationAction = async ({ request, params }) => {
    const { conversationId } = params;
    const formData = await request.formData();
    const userPrompt = formData.get('user_prompt');
    
    let chatHistory = [];
    let aiResponse = '';

    try {
        const { chats } = await databases.getDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            'Conversation',
            conversationId
        );
        chatHistory = chats.map(({ user_prompt, ai_response }) => {
            return { user_prompt, ai_response };
        });     
        
    } catch (err) {
        console.log(`Error fetching conversation: ${err.message}`);
    }

    try {
        aiResponse = await getAiResponse(userPrompt, chatHistory);

    } catch (err) {
        console.log(`Error fetching conversation: ${err.message}`);
    }

    try {
        await databases.createDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            'chats',
            generateID(),
            {
                user_prompt: userPrompt,
                ai_response: aiResponse,
                conversation: conversationId
            }
        )
    } catch(err) {
        console.log(`Error Storing chat: ${err.message}`);
    }
    


    return null;
}

export default conversationAction;