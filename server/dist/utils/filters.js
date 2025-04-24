"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterMessage = exports.validateUsername = void 0;
/**
 * Utilities for filtering and validation
 */
const constants_1 = require("../config/constants");
/**
 * Validates usernames for length, character content, and prohibited terms
 */
const validateUsername = (username) => {
    // Check for empty username
    if (!username || username.trim().length === 0) {
        return { isValid: false, errorMessage: 'Username cannot be empty' };
    }
    // Check length
    if (username.trim().length < 3) {
        return { isValid: false, errorMessage: 'Username must be at least 3 characters' };
    }
    if (username.trim().length > 20) {
        return { isValid: false, errorMessage: 'Username must be 20 characters or less' };
    }
    // Check for valid characters (alphanumeric, hyphen, underscore only)
    const validUsernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!validUsernameRegex.test(username)) {
        return { isValid: false, errorMessage: 'Username can only contain letters, numbers, hyphens (-) and underscores (_)' };
    }
    // Check for unsafe words - username validation is strict
    // First check exact matches for short offensive words
    if (constants_1.USERNAME_UNSAFE_WORDS.some(word => username.toLowerCase() === word)) {
        return { isValid: false, errorMessage: 'This username is not allowed' };
    }
    // Then check if longer usernames contain offensive terms
    if (constants_1.USERNAME_UNSAFE_WORDS.some(word => username.toLowerCase().includes(word))) {
        return { isValid: false, errorMessage: 'This username contains prohibited words' };
    }
    // Check if username matches any regex pattern
    if (constants_1.USERNAME_FILTER_PATTERNS.some(([pattern]) => pattern.test(username))) {
        return { isValid: false, errorMessage: 'This username is not allowed' };
    }
    return { isValid: true };
};
exports.validateUsername = validateUsername;
/**
 * Filters messages to replace bad words and phrases with asterisks
 * Only filters offensive content, not administrative terms
 */
const filterMessage = (message) => {
    if (!message)
        return message;
    let filteredMessage = message;
    // First normalize the message by replacing common bypass separators with a single space
    filteredMessage = filteredMessage.replace(/[-_\s.]+/g, ' ');
    // Apply regex replacements first for sophisticated bypasses
    constants_1.MESSAGE_FILTER_PATTERNS.forEach(([pattern, replacement]) => {
        filteredMessage = filteredMessage.replace(pattern, match => {
            // Use the replacement length if specified, otherwise use match length
            return '*'.repeat(replacement === 'f***' ? 4 : match.length);
        });
    });
    // Replace each banned word with asterisks - now with more flexible matching
    constants_1.MESSAGE_BAD_WORDS.forEach(word => {
        // Escape special characters in the word
        const escapedWord = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        // Create pattern that matches the word with optional separators between letters
        const pattern = escapedWord.split('').join('[^a-zA-Z]*');
        const regex = new RegExp(pattern, 'gi');
        filteredMessage = filteredMessage.replace(regex, '*'.repeat(word.length));
    });
    return filteredMessage;
};
exports.filterMessage = filterMessage;
//# sourceMappingURL=filters.js.map