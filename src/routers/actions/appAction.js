/**
 * @copyright 2024 FangAI
 * @license MIT
 * @author FangAI
 */

/**
 * Node modules
 */
import { redirect } from 'react-router-dom'

/**
 * Custom modules
 */
import { account, databases } from '../../lib/appwrite';
import { getAiResponse, getConversationTitles } from '../../api/googleAi';
import generateID from '../../utils/generateID';

const userPromptAction = async (formData) => {
  const userPrompt = formData.get('user_prompt');

  // Get current user info
  const user = await account.get();

  // Get a conversation title based on user Prompt
  const conversationTitle = (await getConversationTitles(userPrompt)) || 'New Chat';
  let conversation = null;

  try {
    // Create a new conversation document in the Appwrite database
    conversation = await databases.createDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      'conversation',
      generateID(),
      {
        title: conversationTitle,
        user_id: user.$id,
      },
    );
  } catch (err) {
    console.error(`[FangAI] Error creating conversation: ${err.message}`);
  }

  if (!conversation) {
    throw new Error('Failed to create a new conversation.');
  }

  // Generate an AI response based on the user's prompt
  let aiResponse = '';
  try {
    aiResponse = await getAiResponse(userPrompt);
  } catch (err) {
    console.error(`[FangAI] Error getting AI response: ${err.message}`);
    aiResponse = `⚠️ **Error generating AI response**: ${err.message}`;
  }

  if (!aiResponse) {
    aiResponse = "I'm sorry, I couldn't generate a response at this time. Please check your Gemini API key in `.env`.";
  }

  try {
    // Create a new chat document in the 'chats' collection
    await databases.createDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      'chats',
      generateID(),
      {
        user_prompt: userPrompt,
        ai_response: aiResponse,
        conversation: conversation.$id,
      }
    );
  } catch (err) {
    console.error(`[FangAI] Error creating chat: ${err.message}`);
  }

  return redirect(`/${conversation.$id}`);
};

const conversationAction = async (formData) => {
  const conversationId = formData.get('conversation_id');
  const conversationTitle = formData.get('conversation_title') || formData.get('conversation_id');

  try {
    await databases.deleteDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      'conversation',
      conversationId
    );

    return { conversationTitle };
  } catch (err) {
    console.error(`[FangAI] Error deleting conversation: ${err.message}`);
  }
};

const appAction = async ({ request }) => {
  const formData = await request.formData();
  const requestType = formData.get('request_type');

  if (requestType === 'user_prompt') {
    return await userPromptAction(formData);
  }

  if (requestType === 'delete_conversation') {
    return await conversationAction(formData);
  }
};

export default appAction;
