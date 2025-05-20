import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import connectDB from "./db.js";
import userRoutes from "./routes/user.route.js";
import roomRoutes from "./routes/room.route.js";
import { handleSocketEvents } from "./sockets/socketHandler.js";
import cors from "cors";

const app = express();
const server = createServer(app);
const PORT = process.env.PORT;

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN,
    methods: ["GET", "POST"],
  },
});

// Connect to database
await connectDB();

app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    methods: ["GET", "POST"],
  })
);

// Use routes
app.use("/users", userRoutes);
app.use("/rooms", roomRoutes);

io.on("connection", handleSocketEvents);

server.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});
