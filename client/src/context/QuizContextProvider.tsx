import { ReactNode, useEffect, useState } from "react";
import { QuizContext } from "./QuizContext";
import { socket } from "../socket";
import { generateGuid } from "../utils/utils";
import { getActiveSessions, getQuizzes, registerClient } from "../api/api";
import { SocketActions } from "./QuizContextType";
import { SessionStarted } from "@common/SessionStarted";
import Session from "@common/Session";
import { MessageKeys } from "@common/MessageKeys";
import Quiz from "@common/Quiz";
import useSession from "../hooks/useSession";

export const QuizContextProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isJoined, setIsJoined] = useState(false);
  const [clientId, setClientId] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [stateSessionId, setStateSessionId] = useState<string>("");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  // Add a state to track if initial setup is complete
  const [isInitialized, setIsInitialized] = useState(false);

  const sessionId = useSession();

  useEffect(() => {
    if (sessionId) {
      setStateSessionId(sessionId);
      console.log("Session ID from URL:", sessionId);
    } else {
      console.log("No session ID in URL");
    }
  }, [sessionId]); // This effect will run when sessionId changes

  const fetchSessions = async () => {
    try {
      const activeSessions = await getActiveSessions();
      setSessions(activeSessions);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const quizzes = await getQuizzes();
      setQuizzes(quizzes);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []); // Fetch sessions on mount

  useEffect(() => {
    fetchQuizzes();
  }, []); // Fetch quizzes on mount

  useEffect(() => {
    const storedClientId = sessionStorage.getItem("clientId");

    if (storedClientId) {
      setClientId(storedClientId);
    } else {
      const newClientId = generateGuid();
      sessionStorage.setItem("clientId", newClientId);
      setClientId(newClientId);
      console.log("Generated new client ID:", newClientId);
    }
  }, []);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      console.log("Connected to server");
      if (clientId && socket.id) {
        registerClient(clientId, socket.id)
          .then((response) => {
            console.log("Client registered successfully:", response);
          })
          .catch((error) => {
            console.error("Failed to register client:", error);
          });
      }
    };
    socket.on("connect", onConnect);
    return () => {
      socket.off("connect", onConnect);
    };
  }, [clientId]);

  useEffect(() => {
    const onSessionStarted = (session: Session) => {
      console.log("Session started:", session);
      if (session && sessions.find((s) => s.id === session.id) === undefined) {
        setSessions((prevSessions) => [...prevSessions, session]);
      }
    };

    socket.on(MessageKeys.SESSION_STARTED, onSessionStarted);

    return () => {
      socket.off(MessageKeys.SESSION_STARTED, onSessionStarted);
    };
  }, []);

  // Your existing useEffect hooks...

  // Mark initialization as complete after client ID is set
  useEffect(() => {
    if (clientId) {
      setIsInitialized(true);
    }
  }, [clientId]);

  // This effect will run after all other effects have updated their state values
  useEffect(() => {
    // Only run this when fully initialized and all state is ready
    if (!isInitialized) return;

    console.log("All effects have completed execution - Final state:", {
      clientId,
      socketId: socket.id,
      sessionId: stateSessionId,
      isConnected,
      isJoined,
      isAdmin,
      sessionsLoaded: sessions.length,
      quizzesLoaded: quizzes.length,
    });

    if (isConnected && !isJoined) {
      console.log("Socket is connected");
      // Rejoin the session if needed
      if (stateSessionId) {
        socket.emit(
          "rejoin-session",
          { sessionId: stateSessionId, clientId },
          (session: Session) => {
            if (session) {
              console.log("Rejoined session:", session);
              setIsJoined(true);
              setIsAdmin(
                session.users.some(
                  (user) => user.clientId === clientId && user.isAdmin
                )
              );
            } else {
              console.error("Failed to rejoin session");
            }
          }
        );
      }
    }

    // Add any code you want to run after all other effects here
  }, [
    clientId,
    isConnected,
    isJoined,
    stateSessionId,
    isAdmin,
    sessions,
    quizzes,
    isInitialized,
  ]);

  const socketActions: SocketActions = {
    startSession: (message: SessionStarted) => {
      if (isConnected) {
        socket.emit("start-session", message, (session: Session) => {
          if (!session) {
            console.error("Session could not be started");
            return;
          }
          console.log("Session started:", session);
          setIsJoined(true);
          setIsAdmin(true);
          setStateSessionId(session.id);
        });
      }
    },
    joinSession: (message: SessionStarted) => {
      if (isConnected) {
        socket.emit("join-session", message, (session: Session) => {
          console.log("Session joined:", session);
          setIsJoined(true);
        });
      }
    },
  };

  return (
    <QuizContext.Provider
      value={{
        isConnected,
        setIsConnected,
        isJoined,
        setIsJoined,
        clientId,
        socketActions,
        isAdmin,
        sessionId: stateSessionId,
        sessions,
        quizzes,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};
