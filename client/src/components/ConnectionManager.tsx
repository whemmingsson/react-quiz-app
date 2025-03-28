import { useState } from "react";
import { socket } from "../socket";
import styled from "styled-components";
import { useCookies } from "react-cookie";

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 10px;
`;

export const ConnectionManager = ({
  sessions,
  socketId,
  isConnected,
  isJoined,
  handleJoin,
  handleSession,
}: {
  sessions: string[];
  socketId: string;
  isConnected: boolean;
  isJoined: boolean;
  handleJoin: (joined: boolean) => void;
  handleConnect: (connected: boolean) => void;
  handleSession: (session: string) => void;
}) => {
  const [selectedSession, setSelectedSession] = useState("");
  const [cookies] = useCookies(["user"]);

  const join = () => {
    if (!selectedSession) return;

    const data = {
      session: selectedSession,
      socketId,
      userName: cookies.user.username || "Unknown",
    };

    socket.timeout(3000).emit("userjoin", data, () => {
      handleJoin(true);
      handleSession(selectedSession);
    });
  };

  return (
    <Row>
      <select
        onChange={(e) => setSelectedSession(e.target.value)}
        disabled={!isConnected}
      >
        <option key={"session"} value={""}>
          Select session
        </option>
        {sessions.map((session) => (
          <option key={session} value={session}>
            {session}
          </option>
        ))}
      </select>
      <button
        onClick={join}
        style={{ background: "#ddffdd" }}
        disabled={
          isJoined || !isConnected || selectedSession === "" || !selectedSession
        }
      >
        Join session
      </button>
    </Row>
  );
};
