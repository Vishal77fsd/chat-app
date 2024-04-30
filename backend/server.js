import express from "express";
import dotenv from "dotenv";

// File Import
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import { app, server } from "./socket/socket.js";

// Variable
const PORT = process.env.PORT || 5000;

// Config
dotenv.config();

// Middleware
// User Login, Logout, Signup Routes
app.use(express.json()); //to parse the incoming req with JSON payloads
app.use(cookieParser()); //to parse the cookie

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  // root route
  res.send("Hello World!!");
});

server.listen(PORT, () => {
  connectDB();
  console.log(`Server is up and running on PORT : ${PORT}`);
});
