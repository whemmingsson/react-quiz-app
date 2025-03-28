import { ReactNode, useEffect, useState } from "react";
import { QuizContext } from "./QuizContext";
import { socket } from "../socket";

export const QuizContextProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
    };
    socket.on("connect", onConnect);
    return () => {
      socket.off("connect", onConnect);
    };
  }, []);

  return (
    <QuizContext.Provider
      value={{ isConnected, setIsConnected, isJoined, setIsJoined }}
    >
      {children}
    </QuizContext.Provider>
  );
};
