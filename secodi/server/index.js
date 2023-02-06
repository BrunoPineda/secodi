import express from "express";
import http from "http";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import { PORT } from "./config.js";
import cors from "cors";

// Initializations
const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
    cors: {
        //origin: "http://localhost:3000",
    },
});
const __dirname = dirname(fileURLToPath(
    import.meta.url));

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

app.use(express.static(join(__dirname, "../client/build")));

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data, username) => {
        socket.join(data);
        console.log(`User with ID: ${username} joined room: ${data}`);
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", (data) => {

        console.log("User Disconnected", data);

    });
});

server.listen(PORT, () => {
    console.log(`SERVER RUNNING  ${PORT}`);
});