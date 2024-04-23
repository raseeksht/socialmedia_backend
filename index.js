import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { dbConnnect } from './config/dbConfig.js';
import usersRoute from './routes/usersRoute.js';
import { configDotenv } from 'dotenv';
import postsRoute from './routes/postsRoute.js';
import commentsRoute from './routes/commentsRoute.js';
import likesRoute from './routes/likesRoute.js';
import chatRoutes from './routes/chat.routes.js';
import validateUser from './middleware/validateUser.js';
import messageRoute from './routes/message.routes.js';

configDotenv();

dbConnnect();



const app = express();
app.use(cors())
app.use(express.json());

const server = createServer(app);

app.get("/", (req, res) => {
    res.send("API Up and running. <a href='https://documenter.getpostman.com/view/26416014/2sA3Bq3WRX#514ba460-edba-4dd2-ae79-5b489820083f' target='__blank'>docs</a>")
})
app.use("/api/users", usersRoute);
app.use("/api/posts", postsRoute);
app.use("/api/comments", commentsRoute);
app.use("/api/likes", likesRoute);
app.use("/api/chats", validateUser, chatRoutes);
app.use("/api/messages", validateUser, messageRoute);

app.use((req, res, next) => {
    const error = new Error(`404 not found: ${req.originalUrl}`)
    error.status = 404;
    next(error)
})

app.use((err, req, res, next) => {
    res.status(res.statusCode || 500);
    res.json({
        error: {
            message: err.message,
            stack: process.env.NODE_ENV == "production" ? null : err.stack
        }
    })
})


const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})

const io = new Server(server, {
    pingTimeout: 5000,
    cors: {
        origin: "*"
    }
})

io.on("connection", (socket) => {
    console.log("one client connected");
    let token = socket.handshake.headers?.authorization;
    const username = socket.handshake.headers?.username;
    if (!token || !token.startsWith("Bearer ")) {
        // send bearer token required 
        socket.emit("error", "Bearer token required for headers")
        socket.disconnect()

    }
    token = token.split(" ")[1]
    const user = jwt.decode(token, process.env.JWT_SECRET);

    socket.join("online")
    socket.join(user._id)
    socket.emit("connected")

    socket.user = user._id;

    socket.on("joinChat", (chatId) => {
        socket.join(chatId);
        console.log("joined chat ", chatId);
    })

    socket.on("typing", (chatId) => {
        console.log(`typing in ${chatId}`)
        socket.in(chatId).emit("typing")
    })

    socket.on("stoppedTyping", (chatId) => {
        socket.in(chatId).emit("stoppedTyping");
    })

    socket.on("disconnect", () => {
        console.log(`${socket.user} disconnected`);
    })
})