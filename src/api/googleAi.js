/**
 * @copyright 2024 FangAI
 * @license MIT
 * @author FangAI
 */

/**
 * Custom modules
 */
import model, { getModel } from '../lib/googleAi.js';

/**
 * Checks if a string looks like nonsensical keyboard mashing
 */
const isGibberish = (text) => {
  const clean = (text || '').trim().toLowerCase();
  if (clean.length < 3) return false;

  const commonWords = [
    'hi', 'hello', 'hey', 'what', 'how', 'why', 'who', 'when', 'where',
    'can', 'help', 'code', 'react', 'python', 'css', 'html', 'write',
    'explain', 'create', 'make', 'test', 'java', 'sql', 'js', 'bug', 'fix'
  ];

  if (commonWords.some((w) => clean.includes(w))) return false;

  // 4 or more consecutive consonants (e.g. "aeffkfn", "sdfghj")
  if (/[bcdfghjklmnpqrstvwxyz]{4,}/i.test(clean)) return true;

  // 3 or more repeated characters (e.g. "aaaaa")
  if (/(.)\1{2,}/.test(clean)) return true;

  // Unnatural vowel-to-consonant ratios for words longer than 4 chars
  const letters = (clean.match(/[a-z]/gi) || []).length;
  const vowels = (clean.match(/[aeiou]/gi) || []).length;
  if (letters > 4 && (vowels / letters < 0.15 || vowels / letters > 0.85)) {
    return true;
  }

  return false;
};

/**
 * Generate a concise, informative title for the conversation.
 */
const getConversationTitles = async (userPrompt) => {
  if (!userPrompt || !userPrompt.trim()) return 'New Chat';

  if (isGibberish(userPrompt)) {
    return userPrompt.trim().slice(0, 20);
  }

  try {
    const candidateModels = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-2.5-flash'];
    for (const m of candidateModels) {
      try {
        const activeModel = getModel(m) || model;
        if (!activeModel) continue;

        const result = await activeModel.generateContent(
          `Generate a short 2 to 4 word title for this prompt. Return ONLY plain text: "${userPrompt}"`
        );
        const text = result?.response?.text()?.trim();
        if (text) {
          return text.replace(/["'*_#\n]/g, '').slice(0, 36);
        }
      } catch (e) {
        if (e.message?.includes('leaked') || e.message?.includes('quota') || e.message?.includes('429')) break;
      }
    }
  } catch (err) {
    // silent
  }

  // Clean fallback from prompt
  const clean = userPrompt.trim().replace(/\s+/g, ' ');
  return clean.length > 24 ? clean.slice(0, 24) + '...' : clean || 'New Chat';
};

/**
 * Generate an AI response based on the user's prompt and chat history.
 * Maintains full multi-turn conversation flow with Google Gemini.
 *
 * @param {string} userPrompt The user's input prompt
 * @param {Array<{ user_prompt: string, ai_response: string }>} chats Previous chat history
 * @returns {Promise<string>}
 */
const getAiResponse = async (userPrompt, chats = []) => {
  if (!userPrompt || !userPrompt.trim()) {
    return 'Please enter a question or prompt.';
  }

  const promptText = userPrompt.trim();

  // If gibberish, prompt user to clarify
  if (isGibberish(promptText)) {
    return `I'm not sure what you mean by **"${promptText}"**.\n\nCould you please rephrase or let me know what topic, question, or project you'd like help with?`;
  }

  // Build clean chat history for Gemini multi-turn conversation flow
  const history = [];
  (chats || []).forEach(({ user_prompt, ai_response }) => {
    if (
      user_prompt?.trim() &&
      ai_response?.trim() &&
      !ai_response.includes('Gemini API') &&
      !ai_response.includes('Key Required')
    ) {
      history.push(
        {
          role: 'user',
          parts: [{ text: user_prompt.trim() }],
        },
        {
          role: 'model',
          parts: [{ text: ai_response.trim() }],
        },
      );
    }
  });

  // Try live Gemini models
  const candidateModels = [
    'gemini-1.5-flash',
    'gemini-2.0-flash',
    'gemini-2.5-flash',
    'gemini-1.5-pro',
  ];

  let lastError = null;
  for (const modelName of candidateModels) {
    try {
      const activeModel = getModel(modelName) || model;
      if (!activeModel) continue;

      activeModel.generationConfig = { temperature: 0.8 };
      const chat = activeModel.startChat({ history });
      const result = await chat.sendMessage(promptText);
      const text = result?.response?.text();

      if (text && text.trim()) {
        return text.trim();
      }
    } catch (err) {
      lastError = err;
      console.warn(`[FangAI] Gemini model ${modelName} error:`, err.message);
      // If error is 403 or 429, don't keep polling dead Gemini key
      if (err.message?.includes('leaked') || err.message?.includes('quota') || err.message?.includes('429')) {
        break;
      }
    }
  }

  // If live Gemini failed due to key / quota:
  const isQuota = lastError?.message?.includes('quota') || lastError?.message?.includes('429');
  const isLeaked = lastError?.message?.includes('leaked') || lastError?.message?.includes('403');

  return `⚠️ **Gemini API ${isQuota ? 'Quota Exceeded (429)' : isLeaked ? 'Key Blocked (403)' : 'Key Required'}**

Your question: **"${promptText}"** could not be sent to Google Gemini because the API key in \`.env\` has ${isQuota ? 'exceeded its free-tier daily quota' : isLeaked ? 'been flagged by Google as leaked' : 'an active connection issue'}.

**To resolve and get live, 100% relevant answers:**
1. Generate a free API key at [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Update your key in \`.env\`:
   \`\`\`env
   VITE_GEMINI_API_KEY=your_new_key_here
   \`\`\`
   *(Or click your user avatar in the top right $\rightarrow$ **Gemini API Key** to paste it immediately in the browser).*
3. Ask your question again, and FangAI will deliver full, accurate answers with complete conversation context!`;
};

export { getConversationTitles, getAiResponse };
