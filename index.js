import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import sequelize from "./model/sequelize.js";
import "./model/associations.js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import userRouter from "./routes/userRoute.js";
import chatRouter from "./routes/chatRoute.js";
import decodeTokenMiddleware from "./middleware/authMiddleware.js";
import messageRouter from "./routes/messageRoute.js";
import { Server } from "socket.io";

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(decodeTokenMiddleware);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.URL,
    credentials: true,
    methods: "*",
  })
);
sequelize
  .sync()
  .then(() => {
    console.log("Database & tables created!");
  })
  .catch((err) => {
    console.error("Unable to create database & tables:", err);
  });

app.use("/", userRouter);
app.use("/chat", chatRouter);
app.use("/messages", messageRouter);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.URL,
  },
});

io.on("connection", (socket) => {
  console.log(socket,'connected');
  socket.on("setup", (userData) => {
    console.log(userData,'userData');
    socket.join(userData.id);
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  socket.on("new message", (newMessageReceived) => {
    console.log(newMessageReceived,'newMessageReceived');
    const chat = newMessageReceived.chat;
    if (!chat.users) return console.log("Chat users not defined");
    chat.users.forEach((user) => {
      if (user !== newMessageReceived.sender.id) {
        socket.to(user).emit("message received", newMessageReceived);
      }
    });
  });
  socket.on("disconnect", () => {
    console.log(`User with socket ID: ${socket.id} disconnected`);
  });
});
