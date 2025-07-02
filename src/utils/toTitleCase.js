/**
 * @copyright 2024 FangAI
 * @license MIT
 * @author FangAI
 */

export default function toTitleCase(text) {
  return text
    .split(' ')
    .map((i) => i.replace(i[0], i[0].toUpperCase()))
    .join(' ');
}
