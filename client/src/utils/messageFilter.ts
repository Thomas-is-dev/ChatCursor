/**
 * Client-side message filtering implementation
 * Matches server-side filtering for consistency
 */

// Import the same constants used on the server
import {
  MESSAGE_BAD_WORDS,
  MESSAGE_FILTER_PATTERNS,
} from "../shared/constants";

type FilterPattern = [RegExp, string];

/**
 * Filters messages to replace bad words and phrases with asterisks
 * Implements the same logic as the server-side filtering
 */
export const filterMessage = (message: string): string => {
  if (!message) return message;

  let filteredMessage = message;

  // First normalize the message by replacing common bypass separators with a single space
  filteredMessage = filteredMessage.replace(/[-_\s.]+/g, " ");

  // Apply regex replacements first for sophisticated bypasses
  MESSAGE_FILTER_PATTERNS.forEach(([pattern, replacement]: FilterPattern) => {
    filteredMessage = filteredMessage.replace(pattern, (match) => {
      // Use the replacement length if specified, otherwise use match length
      return "*".repeat(replacement === "f***" ? 4 : match.length);
    });
  });

  // Replace each banned word with asterisks - now with more flexible matching
  MESSAGE_BAD_WORDS.forEach((word: string) => {
    // Escape special characters in the word
    const escapedWord = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    // Create pattern that matches the word with optional separators between letters
    const pattern = escapedWord.split("").join("[^a-zA-Z]*");
    const regex = new RegExp(pattern, "gi");
    filteredMessage = filteredMessage.replace(regex, "*".repeat(word.length));
  });

  return filteredMessage;
};
