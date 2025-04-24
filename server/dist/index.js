"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Main server file for the chat application
 */
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const crypto_1 = __importDefault(require("crypto"));
// Import socket handlers
const userHandlers_1 = require("./socket/userHandlers");
const messageHandlers_1 = require("./socket/messageHandlers");
// Setup Express app
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Create HTTP server
const server = http_1.default.createServer(app);
// Create Socket.IO server
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
// Generate secure encryption keys
const MASTER_KEY = crypto_1.default.randomBytes(32).toString('hex');
const SHARED_KEY = crypto_1.default.randomBytes(32).toString('hex');
// Setup socket connection handler
io.on('connection', (socket) => {
    // Handle user login
    socket.on('login', (data) => {
        (0, userHandlers_1.handleLogin)(io, socket, data, SHARED_KEY, MASTER_KEY);
    });
    // Handle user reconnection
    socket.on('reconnect_user', (data) => {
        (0, userHandlers_1.handleReconnection)(io, socket, data, SHARED_KEY, MASTER_KEY);
    });
    // Handle encrypted chat messages (legacy)
    socket.on('send_message', (encryptedMessage, messageId, callback) => {
        (0, messageHandlers_1.handleMessage)(io, socket, encryptedMessage, messageId, callback);
    });
    // Handle unencrypted messages that need server-side filtering
    socket.on('send_unencrypted_message', (message, messageId, callback) => {
        (0, messageHandlers_1.handleUnencryptedMessage)(io, socket, message, SHARED_KEY, messageId, callback);
    });
    // Handle explicit user logout
    socket.on('user_logout', (username) => {
        (0, userHandlers_1.handleLogout)(io, socket, username);
    });
    // Handle disconnection
    socket.on('disconnect', () => {
        (0, userHandlers_1.handleDisconnect)(io, socket);
    });
});
// Start the server
const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
    console.log("\n==================================================");
    console.log(`🚀 Server started successfully`);
    console.log(`🌐 Listening on port ${PORT}`);
    console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
    console.log(`🔑 Master key: ${MASTER_KEY.substring(0, 10)}...`);
    console.log(`🔐 Shared key: ${SHARED_KEY.substring(0, 10)}...`);
    console.log("==================================================\n");
});
//# sourceMappingURL=index.js.map