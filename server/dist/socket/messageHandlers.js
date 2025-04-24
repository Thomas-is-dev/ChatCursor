"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUnencryptedMessage = exports.handleMessage = void 0;
const filters_1 = require("../utils/filters");
const userHandlers_1 = require("./userHandlers");
const crypto_1 = __importDefault(require("crypto"));
require("colors");
const getTimestamp = () => `[${new Date().toLocaleString('fr-FR')}]`.gray;
/**
 * Process and relay messages between users
 * Apply filtering for offensive content
 */
const handleMessage = (io, socket, encryptedMessage, messageId, callback) => {
    const username = (0, userHandlers_1.getUserBySocketId)(socket.id);
    // Always acknowledge the message even if we don't have a username
    const ackCallback = (success) => {
        if (typeof callback === 'function') {
            try {
                callback(success);
            }
            catch (error) {
                console.error(`${getTimestamp()} ${'Error sending acknowledgement:'.red}`, error);
            }
        }
    };
    try {
        if (!username) {
            // User not found, send error acknowledgement
            console.warn(`${getTimestamp()} ${'Message rejected:'.yellow} no username found for socket ${socket.id}`);
            ackCallback(false);
            return;
        }
        // Since the message is encrypted, we can't filter the actual content
        // We're limited to relaying the encrypted content as-is
        console.log(`${getTimestamp()} Message from ${username.cyan} ${'(encrypted)'.gray}`);
        // Create the message object with the client-encrypted content
        const messageObject = {
            encryptedContent: encryptedMessage.content,
            iv: encryptedMessage.iv,
            username: username,
            time: new Date().toLocaleTimeString(),
            id: messageId || `${username}-${Date.now()}`
        };
        // Broadcast to all clients
        io.emit('receive_message', messageObject);
        // Send positive acknowledgement
        ackCallback(true);
    }
    catch (error) {
        console.error(`${getTimestamp()} ${'Error processing message:'.red}`, error);
        ackCallback(false);
    }
};
exports.handleMessage = handleMessage;
/**
 * Process and relay unencrypted messages between users
 * Apply server-side filtering for offensive content before encryption
 */
const handleUnencryptedMessage = (io, socket, message, encryptionKey, messageId, callback) => {
    const username = (0, userHandlers_1.getUserBySocketId)(socket.id);
    // Always acknowledge the message even if we don't have a username
    const ackCallback = (success) => {
        if (typeof callback === 'function') {
            try {
                callback(success);
            }
            catch (error) {
                console.error(`${getTimestamp()} ${'Error sending acknowledgement:'.red}`, error);
            }
        }
    };
    try {
        if (!username) {
            // User not found, send error acknowledgement
            console.warn(`${getTimestamp()} ${'Message rejected:'.yellow} no username found for socket ${socket.id}`);
            ackCallback(false);
            return;
        }
        // Apply server-side filtering to the plain text message
        const filteredMessage = (0, filters_1.filterMessage)(message);
        // Only log if message was actually filtered (different from original)
        if (filteredMessage !== message) {
            console.log(`${getTimestamp()} Message from ${username.cyan} ${'(banned words detected)'.red}: "${message.yellow}"`);
            console.log(`${getTimestamp()} ${'Filtered message sent to clients:'.green} "${filteredMessage.white}"`);
        }
        else {
            console.log(`${getTimestamp()} Message from ${username.cyan}: "${message.white}"`);
        }
        // Encrypt the filtered message using the server's encryption key
        const iv = crypto_1.default.randomBytes(16);
        const cipher = crypto_1.default.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), iv);
        let encrypted = cipher.update(filteredMessage, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        // Create the message object with the server-filtered, server-encrypted content
        const messageObject = {
            encryptedContent: encrypted,
            iv: iv.toString('hex'),
            username: username,
            time: new Date().toLocaleTimeString(),
            id: messageId || `${username}-${Date.now()}`
        };
        // Broadcast to all clients
        io.emit('receive_message', messageObject);
        // Send positive acknowledgement
        ackCallback(true);
    }
    catch (error) {
        console.error(`${getTimestamp()} ${'Error processing unencrypted message:'.red}`, error);
        ackCallback(false);
    }
};
exports.handleUnencryptedMessage = handleUnencryptedMessage;
//# sourceMappingURL=messageHandlers.js.map