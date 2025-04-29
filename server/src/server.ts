import express from "express";
import path from "path";
import { createServer } from "node:http";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import UserService from "./services/UserService.js";
import SessionService from "./services/SessionService.js";
import UserJoinEventData  from "@common/UserJoinEventData.js";
import {instrument} from "@socket.io/admin-ui";
import cors from "cors"; // Add this import for CORS middleware

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

app.use(express.json());

// Add CORS middleware configuration for Express
app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST"],
  credentials: true
}));

// Handle React routing, return index.html for all other routes, unless client routed
app.get("*", (_, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

// Services
const userService = new UserService();
const sessionService = new SessionService(); 

// API endpoints
// API endpoint for client registration


type RegisterClientBody = express.Request<{}, {}, {   clientId: string;
  socketId: string; }>;

app.post('/api/register', (req:RegisterClientBody, res:any) => {
  try {
    const { clientId, socketId } = req.body;
    
    if (!clientId || !socketId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Both clientId and socketId are required' 
      });
    }
    
    // Call the user service function (which you'll implement)
    // This is a placeholder - you'll need to implement this method in UserService
    const result = userService.registerClient(clientId, socketId);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Client registered successfully',
      data: result
    });
  } catch (error) {
    console.error('Error registering client:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error during registration'
    });
  }
});

io.on("connection", (socket) => {
  // Create user
  userService.createUser(socket.id);
  console.log("a user connected:", socket.id);

  // Run when a user disconnects from the socket
  socket.on("disconnect", () => {
    userService.deleteUser(socket.id);
  });

  // Add to your socket.io connection handler in server.ts
socket.on("manual-disconnect", (clientId, callback) => {
  console.log(`User with clientId ${clientId} manually disconnected`);
  // Any cleanup you want to do when user manually disconnects
  userService.deleteUser(socket.id);
  callback(); // Acknowledge the event
});

  // Run when a user requests to join a session
  socket.on("userjoin", (clientJoinData:UserJoinEventData, callback) => {

  });

  // Run when a user requests to start a session
  // The user is promoted admin
  socket.on("start-session", (clientJoinData: UserJoinEventData, callback) => {

  });

  // Run when the session admin requests to kill a session
  socket.on("kill-session", (socketId, callback) => {
   
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


