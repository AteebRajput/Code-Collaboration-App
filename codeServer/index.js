const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Update this if your React app uses a different port
        methods: ["GET", "POST"],
    },
});

const userSocketMap = {};

// Function to get all connected clients in a specific room
const getAllConnectedClients = (roomId) => {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => ({
            socketId,
            username: userSocketMap[socketId],
        })
    );
};

// Store the latest code for each room
const roomCodeMap = {};

// Handling socket connection
io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Handling a user joining a room
    socket.on("join", ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);

        const clients = getAllConnectedClients(roomId);
        console.log(`Room ID: ${roomId}`, clients);

        // Send the current code to the new client
        const currentCode = roomCodeMap[roomId] || "// Start coding here...";
        socket.emit("initCode", { code: currentCode });

        // Broadcast the updated client list to all clients in the room
        io.to(roomId).emit("updateClients", { clients, username });
    });

    // Handling code changes
    socket.on("codeChange", ({ roomId, code }) => {
        // Store the latest code for the room
        roomCodeMap[roomId] = code;

        // Broadcast the code to all other clients in the room
        socket.to(roomId).emit("codeUpdate", { code });
    });

    // Handling the logic when user leave or disconnect
    socket.on("disconnecting", () => {
        const rooms = Array.from(socket.rooms); // Get all rooms the socket is currently in
        rooms.forEach((roomId) => {
            if (roomId !== socket.id) {
                io.to(roomId).emit("disconnected", {
                    socketId: socket.id,
                    username: userSocketMap[socket.id],
                });
            }
        });

        // Clean up the user from userSocketMap
        delete userSocketMap[socket.id];
        console.log(`User Disconnected: ${socket.id}`);
    });
});

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
