require("dotenv").config();
require("./src/config/googleAuthConfig");

const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const verifyAccessToken = require("./src/middleware/verifyAccessToken");

const { connectDB } = require("./src/config/database");

const authRoutes = require("./src/routes/auth");
const userRoutes = require("./src/routes/user");
const folderRoutes = require("./src/routes/folder");
const noteRoutes = require("./src/routes/note");
const sharedFilesRoute = require("./src/routes/sharedFiles");
const eventsRoute = require("./src/routes/event");
const notificationRoute = require("./src/routes/notification");

const PORT = process.env.PORT || 5000;
app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
connectDB();


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

/*Unprotected Route*/
app.use("/api/auth", authRoutes);


app.use(verifyAccessToken);

// API Routes (protected)
app.use("/api/users", userRoutes);
app.use("/api/folder", folderRoutes);
app.use("/api/note", noteRoutes);
app.use("/api/sharedFiles", sharedFilesRoute);
app.use("/api/events", eventsRoute);
app.use("/api/notification", notificationRoute);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
