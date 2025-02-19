require('dotenv').config(); 

const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { connectDB } = require("./src/config/database"); // Database connection
const verifyJWT = require('./src/middleware/verifyJWT'); // Authentication middleware

const userRoutes = require("./src/routes/user");
const refreshRoute = require("./src/routes/refresh");
const folderRoutes = require("./src/routes/folder");
const noteRoutes = require("./src/routes/note");
const sharedFilesRoute = require("./src/routes/sharedFiles");
const eventsRoute = require("./src/routes/event");
const notificationRoute = require("./src/routes/notification");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB(); 

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/refresh", refreshRoute);


app.use(verifyJWT);

// API Routes (protected)
app.use("/api/users", userRoutes);
app.use("/api/folder", folderRoutes);
app.use("/api/note", noteRoutes);
app.use("/api/sharedFiles", sharedFilesRoute);
app.use("/api/events", eventsRoute);
app.use("/api/notification", notificationRoute);

// Socket.io (if you're using it)
/*
const { Server } = require('socket.io');
const io = new Server(8000, { cors: true });
require('./socketServer')(io);
*/

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});