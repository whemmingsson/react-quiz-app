import { ReactNode, useEffect, useState } from "react";
import { QuizContext } from "./QuizContext";
import { socket } from "../socket";
import { generateGuid } from "../utils/utils";
import { registerClient } from "../api/api";

export const QuizContextProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isJoined, setIsJoined] = useState(false);
  const [clientId, setClientId] = useState<string>("");

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

  return (
    <QuizContext.Provider
      value={{ isConnected, setIsConnected, isJoined, setIsJoined, clientId }}
    >
      {children}
    </QuizContext.Provider>
  );
};
