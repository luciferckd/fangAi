/**
 * @copyright 2024 FangAI
 * @license MIT
 * @author FangAI
 */

/**
 * Custom modules
 */
import model from '../lib/googleAi';

const getConversationTitles = async (userPrompt) => {
  try {
    const result = await model.generateContent(
      `Given a user prompt, generate a concise and informative title that accurately describes the conversation. 
      Consider keywords, topics and the overall intent of the prompt. 
      Response in plain text format, not markdown.
            
            Prompt: ${userPrompt}`,
    );
    return result.response.text();
  } catch (err) {
    console.log(`Error generating title: ${err.message}`);
  }
};

/**
 *
 * @param {string} userPrompt  The user's input prompt
 * @param {Array<{ user_prompt: string, ai_response: string }>} chat  An array of previous user prompts and AI responses, used to provide context to the model. @returns {Promise<string} A promise that resolves with the AI's response, or rejects with an error.
 */

const getAiResponse = async (userPrompt, chats = []) => {
  const history = [];
  chats.forEach(({ user_prompt, ai_response }) => {
    history.push(
      { 
        role: 'user', 
        parts: [{ text: user_prompt }]
      },
      {
        role: 'model', 
        parts: [{ text: ai_response }]
      }
    );
  });
  

  try {
    model.generationConfig = { temperature: 1.5 };
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(userPrompt);

    return result.response.text();
  } catch (err) {
    console.log(`Error generating AI response: ${err.message}`);
  }
};

export { getConversationTitles, getAiResponse };
