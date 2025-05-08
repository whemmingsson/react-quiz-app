import { ReactNode, useEffect, useState } from "react";
import { QuizContext } from "./QuizContext";
import { socket } from "../socket";
import { generateGuid } from "../utils/utils";
import { getActiveSessions, getQuizzes, registerClient } from "../api/api";
import { SocketActions } from "./QuizContextType";
import { SessionStarted } from "@common/messages/SessionStarted";
import Session from "@common/Session";
import { MessageKeys } from "@common/messages/MessageKeys";
import Quiz from "@common/Quiz";

export const QuizContextProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isJoined, setIsJoined] = useState(false);
  const [clientId, setClientId] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

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
          setSessionId(session.id);
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
        sessionId,
        sessions,
        quizzes,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};
