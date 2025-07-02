/**
 * @copyright 2024 FangAI
 * @license MIT
 * @author FangAI
 */


/**
 * Node Modules
 * 
 * 
 * @return {string} - A unique identifier string.
 */

export default function generateID() {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
}