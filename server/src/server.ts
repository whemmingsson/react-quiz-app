import express from "express";
import path from "path";
import { createServer } from "node:http";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import UserService from "./services/UserService.js";
import SessionService from "./services/SessionService.js";
import UserJoinEventData  from "@common/UserJoinEventData.js";
import {instrument} from "@socket.io/admin-ui";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["https://admin.socket.io","http://localhost:5173"],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}
});

instrument(io, {
  auth: false, 
});

const PORT = process.env.PORT || 5000; 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);  

// Path to the React build folder
const clientBuildPath = path.join(__dirname, "..", "client", "dist");

// Serve static files from React's build folder
app.use(express.static(clientBuildPath));

// Handle React routing, return index.html for all other routes, unless client routed
app.get("*", (_, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

// Services
const userService = new UserService();
const sessionService = new SessionService(); 

io.on("connection", (socket) => {
  // Create user
  userService.createUser(socket.id);
  console.log("a user connected:", socket.id);

  // Run when a user disconnects from the socket
  socket.on("disconnect", () => {
    userService.deleteUser(socket.id);
    console.log("a user disconnected:", socket.id);
  });

  // Run when a user requests to join a session
  socket.on("userjoin", (clientJoinData:UserJoinEventData, callback) => {
    const { socketId, sessionId, userName } = clientJoinData;
    const user = userService.getUser(socket.id);
    console.log("name", userName);

    if (user) {
      sessionService.addAsPlayer(sessionId, user, userName, socketId);
      callback(0);
      socket.broadcast.emit("userjoined", socketId);
    }
    else {
      console.log(`User with clientId = ${socketId} not found`);
    }
  });

  // Run when a user requests to start a session
  // The user is promoted admin
  socket.on("start-session", (clientJoinData: UserJoinEventData, callback) => {
    console.log("start-session", clientJoinData); 
    const { socketId, userName } = clientJoinData;
    const session = sessionService.createSession(socketId);
    const user = userService.getUser(socket.id); 

    if (!user) {
      console.log(`User with socketId = ${socketId} not found`);
      return;
    }

    sessionService.addAsAdmin(session, user, userName);

    console.log(`Session with id = ${socketId} started`);
    console.log(`User with clientId = ${socketId} promoted to admin`);

    // Notify all users that a session has started
    socket.broadcast.emit("session", socketId);
  });

  // Run when the session admin requests to kill a session
  socket.on("kill-session", (socketId, callback) => {
    const session = sessionService.killSession(socketId);

    if (!session) {
      console.log(`Session with id = ${socketId} not found`);
      return;
    }

    socket.broadcast.emit("sessionkilled", socketId);
  });

  // When a super admin requests the server state
  socket.on("fetchserverstate", (callback) => {
    const state = {
      users: userService.getUsers(),
      sessions: sessionService.getSessions(),
    };

    callback(state);
  }); 
});

// On startup
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});   


