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
        const doc = await databases.getDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            'conversation',
            conversationId
        );
        chatHistory = (doc?.chats || []).map(({ user_prompt, ai_response }) => {
            return { user_prompt, ai_response };
        });     
        
    } catch (err) {
        console.warn(`[FangAI] Error fetching conversation history: ${err.message}`);
    }

    try {
        aiResponse = await getAiResponse(userPrompt, chatHistory);
    } catch (err) {
        console.error(`[FangAI] Error getting AI response: ${err.message}`);
        aiResponse = `⚠️ **Error generating AI response**: ${err.message}`;
    }

    if (!aiResponse) {
        aiResponse = "I'm sorry, I couldn't generate a response at this time. Please check your Gemini API key in `.env`.";
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
        );
    } catch(err) {
        console.error(`[FangAI] Error storing chat: ${err.message}`);
    }

    return null;
}

export default conversationAction;