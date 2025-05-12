import express from "express";
import path from "path";
import { createServer } from "node:http";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import UserService from "./services/UserService.js";
import SessionService from "./services/SessionService.js";
import { instrument } from "@socket.io/admin-ui";
import cors from "cors"; // Add this import for CORS middleware
import QuizService from "./services/QuizService..js";
import { SessionStarted } from "../../common/SessionStarted.js";
import { UserJoinedSessionData } from "../../common/UserJoinedSessionData.js";
import { MessageKeys } from "../../common/MessageKeys.js";
import Session from "../../common/Session.js";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["https://admin.socket.io", "http://localhost:5173"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
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
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Services
const userService = new UserService();
const sessionService = new SessionService();
const quizService = new QuizService();

//Helper interface
interface HeaderData {
  clientId: string;
  sessionId: string;
}

// Helper function to extract custom headers from http request headers
const extractHeaderData = (req: express.Request): HeaderData => {
  const clientId = req.headers["x-client"] as string;
  const sessionId = req.headers["x-session"] as string;

  return {
    clientId: clientId || "",
    sessionId: sessionId || "",
  };
};

// API endpoints
// API endpoint for client registration

type RegisterClientBody = express.Request<
  {},
  {},
  { clientId: string; socketId: string }
>;

app.post("/api/register", (req: RegisterClientBody, res: any) => {
  try {
    const { clientId, socketId } = req.body;

    if (!clientId || !socketId) {
      return res.status(400).json({
        success: false,
        message: "Both clientId and socketId are required",
      });
    }

    // Call the user service function (which you'll implement)
    // This is a placeholder - you'll need to implement this method in UserService
    const result = userService.registerClient(clientId, socketId);

    return res.status(200).json({
      success: true,
      message: "Client registered successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error registering client:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
});

// API endpoint for setting username
interface SetUsernameRequestBody {
  clientId: string;
  username: string;
}

app.post(
  "/api/username",
  (req: express.Request<{}, {}, SetUsernameRequestBody>, res: any) => {
    try {
      const { clientId, username } = req.body;

      if (!clientId || !username) {
        return res.status(400).json({
          success: false,
          message: "Both clientId and username are required",
        });
      }

      // Call the user service function to save the username
      // This is a placeholder - you'll need to implement this method
      const result = userService.setUsername(clientId, username);

      return res.status(200).json({
        success: true,
        message: "Username saved successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error saving username:", error);
      return res.status(500).json({
        success: false,
        message: "Server error while saving username",
      });
    }
  }
);

// API endpoint for fetching all saved quizzes
app.get("/api/quizzes", (req, res) => {
  console.log("Fetching all quizzes");
  const quizzes = quizService.getAllQuizzes();
  res.json(quizzes);
});

// API endpoint for fetching a quiz by ID
app.get("/api/quiz/:id", (req, res) => {
  console.log("Fetching quiz with id:", req.params.id);
  const headerData = extractHeaderData(req);

  if (!headerData.clientId || !headerData.sessionId) {
    return res.status(400).json({
      success: false,
      message: "Both clientId and sessionId are required in headers",
    });
  }

  const session = sessionService.getSession(headerData.sessionId);
  if (!session) {
    return res.status(404).json({
      success: false,
      message: "Session not found. Was it started?",
    });
  }

  const quizzes = quizService.getQuizById(req.params.id);
  return res.json(quizzes);
});

// API endpoint for fetching all active sessions
app.get("/api/sessions", (req, res) => {
  console.log("Fetching all sessions");
  const sessions = sessionService.getSessions();
  res.json(sessions);
});

// Api emdpoint for purging all sessions and users
app.post("/api/admin/purge", (req, res) => {
  console.log("Deleting all sessions");
  sessionService.purgeSessions();
  userService.purgeUsers();
  res.json({ message: "All data purged" });
});

// // API endpoint to start a new session
// app.post('/api/session/start', (req, res) => {

//   res.json(quizzes);
// });

// // API endpoint for joining a session
// app.post('/api/session/:sessionId/join', (req, res) => {

//   res.json(quizzes);
// });

// AFTER all API endpoints, add the catch-all route
app.get("*", (_, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
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
  socket.on("join-session", (sessionJoinData: SessionStarted, callback) => {
    console.log("User joined session:", sessionJoinData);

    const user = userService.getUser(socket.id);
    if (user && sessionJoinData.sessionId) {
      // Add the user to the session

      const session = sessionService.addAsPlayer(
        sessionJoinData.sessionId,
        user
      );

      if (!session) {
        console.error("Session not found");
        callback(null);
        return;
      }

      const userJoinedData: UserJoinedSessionData = {
        session,
        user,
      };

      socket.broadcast.emit("user-joined", userJoinedData);

      callback(session);
    } else {
      console.error("User not found or session ID is missing");
      callback(null);
      return;
    }
  });

  socket.on("rejoin-session", (sessionJoinData: SessionStarted, callback) => {
    console.log("User rejoined session:", sessionJoinData);
    if (!sessionJoinData.sessionId) {
      console.error("Session ID is missing");
      callback(null);
      return;
    }

    const session = sessionService.rejoinSession(
      sessionJoinData.sessionId,
      sessionJoinData.clientId
    );

    if (!session) {
      console.error("Session not found");
      callback(null);
      return;
    }

    callback(session);
  });

  // Run when a user requests to start a session
  // The user is promoted admin
  socket.on("start-session", (sessionStartData: SessionStarted, callback) => {
    console.log("Session started:", sessionStartData);

    // Check if the user is already in a session
    const existingSession = sessionService.sessionExists(
      sessionStartData.clientId
    );
    if (existingSession) {
      console.error("User is already in a session");
      callback(null);
      return;
    }

    const user = userService.getUser(socket.id);
    let session: Session | null = null;

    if (user) {
      session = sessionService.createSession(sessionStartData.clientId, user);
      socket.broadcast.emit(MessageKeys.SESSION_STARTED, session);
      callback(session);
    } else {
      console.error("User not found");
      callback(null);
      return;
    }
  });

  // Run when the session admin requests to kill a session
  socket.on("kill-session", (socketId, callback) => {});

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
