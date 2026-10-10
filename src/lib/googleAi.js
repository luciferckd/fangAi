/**
 * @copyright 2024 FangAI
 * @license MIT
 * @author FangAI
 */

/**
 * Node modules
 */
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Retrieve the active Gemini API key from localStorage (if configured in UI)
 * or fallback to environment variable VITE_GEMINI_API_KEY.
 */
export const getApiKey = () => {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('gemini_api_key');
    if (local && local.trim()) return local.trim();
  }
  return (
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) ||
    (typeof process !== 'undefined' && process.env?.VITE_GEMINI_API_KEY) ||
    ''
  );
};

export const getGenAI = () => {
  const key = getApiKey();
  return key ? new GoogleGenerativeAI(key) : null;
};

export const getModel = (modelName = 'gemini-1.5-flash') => {
  const ai = getGenAI();
  if (!ai) return null;
  try {
    return ai.getGenerativeModel({ model: modelName });
  } catch (err) {
    console.warn(`[FangAI] Error creating model ${modelName}:`, err);
    return null;
  }
};

const model = getModel('gemini-1.5-flash') || getModel('gemini-2.5-flash');

export default model;