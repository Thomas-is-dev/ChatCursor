"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDisconnect = exports.handleLogout = exports.handleReconnection = exports.handleLogin = exports.removeUser = exports.addUser = exports.getUserBySocketId = exports.userExists = exports.getAllUsers = exports.logUserCount = void 0;
const filters_1 = require("../utils/filters");
require("colors");
const getTimestamp = () => `[${new Date().toLocaleString('fr-FR')}]`.gray;
// Store connected users
const users = new Map(); // socket id -> username
// Helper function to log user count
const logUserCount = () => {
    console.log(`${getTimestamp()} ${'Total users:'.cyan} ${String(users.size).yellow}`);
};
exports.logUserCount = logUserCount;
// Get all users
const getAllUsers = () => {
    return Array.from(users.values());
};
exports.getAllUsers = getAllUsers;
// Check if user exists
const userExists = (username) => {
    return Array.from(users.values()).includes(username);
};
exports.userExists = userExists;
// Get username by socket id
const getUserBySocketId = (socketId) => {
    return users.get(socketId);
};
exports.getUserBySocketId = getUserBySocketId;
// Add user
const addUser = (socketId, username) => {
    users.set(socketId, username);
};
exports.addUser = addUser;
// Remove user
const removeUser = (socketId) => {
    const username = users.get(socketId);
    if (username) {
        users.delete(socketId);
    }
    return username;
};
exports.removeUser = removeUser;
/**
 * Handle user login
 */
const handleLogin = (io, socket, data, sharedKey, masterKey) => {
    const username = data.username;
    // Validate username
    const validation = (0, filters_1.validateUsername)(username);
    if (!validation.isValid) {
        console.log(`${getTimestamp()} ${'Login failed:'.red} ${validation.errorMessage}`);
        socket.emit('loginError', { message: validation.errorMessage });
        return;
    }
    // Check if username is already taken by an active connection
    if ((0, exports.userExists)(username)) {
        console.log(`${getTimestamp()} ${'Login failed:'.red} Username "${username}" already taken`);
        socket.emit('loginError', { message: 'Username already taken' });
        return;
    }
    // Store the user
    (0, exports.addUser)(socket.id, username);
    console.log(`${getTimestamp()} User ${username.cyan} ${'connected'.green}`);
    (0, exports.logUserCount)();
    // Send the encryption key to the user
    socket.emit('encryption_key', {
        key: sharedKey,
        masterKey: masterKey
    });
    // Notify the user of successful login
    socket.emit('loginSuccess', username);
    // Notify all users about the new user
    io.emit('user_joined', username);
    // Send the current user list to the new user
    socket.emit('user_list', (0, exports.getAllUsers)());
    // Send the updated user list to everyone
    io.emit('user_list', (0, exports.getAllUsers)());
};
exports.handleLogin = handleLogin;
/**
 * Handle user reconnection
 */
const handleReconnection = (io, socket, data, sharedKey, masterKey) => {
    const username = data.username;
    console.log(`${getTimestamp()} ${'Reconnection attempt:'.yellow} User ${username.cyan}`);
    // Validate username
    const validation = (0, filters_1.validateUsername)(username);
    if (!validation.isValid) {
        console.log(`${getTimestamp()} ${'Reconnection failed:'.red} ${validation.errorMessage}`);
        socket.emit('reconnection_failed', validation.errorMessage);
        return;
    }
    // Check if this username is already in the list
    const existingSocketId = [...users.entries()]
        .find(([_, name]) => name === username)?.[0];
    // If the username exists with a different socket, update it
    if (existingSocketId && existingSocketId !== socket.id) {
        console.log(`${getTimestamp()} ${'Updating socket:'.yellow} ${existingSocketId} -> ${socket.id} for user ${username.cyan}`);
        users.delete(existingSocketId);
    }
    // Store/update the user with the new socket ID
    (0, exports.addUser)(socket.id, username);
    console.log(`${getTimestamp()} User ${username.cyan} ${'reconnected successfully'.green}`);
    // Send shared encryption key
    socket.emit('encryption_key', {
        key: sharedKey,
        masterKey: masterKey
    });
    // Inform the user their reconnection was successful
    socket.emit('reconnection_successful', username);
    // Send the current user list to the reconnected user
    socket.emit('user_list', (0, exports.getAllUsers)());
    // Send the updated user list to everyone
    io.emit('user_list', (0, exports.getAllUsers)());
    (0, exports.logUserCount)();
};
exports.handleReconnection = handleReconnection;
/**
 * Handle user logout
 */
const handleLogout = (io, socket, username) => {
    (0, exports.removeUser)(socket.id);
    // Check if username exists in any other active connections
    const usernameStillExists = (0, exports.userExists)(username);
    if (!usernameStillExists) {
        console.log(`${getTimestamp()} User ${username.cyan} ${'logged out'.yellow}`);
        io.emit('user_left', username);
    }
    (0, exports.logUserCount)();
};
exports.handleLogout = handleLogout;
/**
 * Handle user disconnection
 */
const handleDisconnect = (io, socket) => {
    const username = (0, exports.getUserBySocketId)(socket.id);
    if (username) {
        (0, exports.removeUser)(socket.id);
        // Check if username exists in any other active connections
        const usernameStillExists = (0, exports.userExists)(username);
        if (!usernameStillExists) {
            console.log(`${getTimestamp()} User ${username.cyan} ${'disconnected'.yellow}`);
            io.emit('user_left', username);
        }
        (0, exports.logUserCount)();
    }
};
exports.handleDisconnect = handleDisconnect;
//# sourceMappingURL=userHandlers.js.map