import styled from "styled-components";
import { socket } from "../socket";
import { useCookies } from "react-cookie";
import UserJoinEventData from "@common/UserJoinEventData.js";

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  background: #f0f0f0;
`;

const AdminPanel = ({
  socketId,
  handleOnKill,
  handleOnStart,
  connected,
  isAdmin,
  session,
}: {
  socketId: string | null;
  isAdmin: boolean;
  handleOnKill: () => void;
  handleOnStart: () => void;
  connected: boolean;
  session: string;
}) => {
  const [cookies] = useCookies(["user"]);

  const startSession = () => {
    const data: UserJoinEventData = {
      sessionId: socketId || "",
      socketId: socketId || "",
      userName: cookies.user.username || "Unknown",
    };
    socket.emit("start-session", data, () => {});
    handleOnStart();
  };

  const killSession = () => {
    socket.emit("kill-session", session, () => {});
    handleOnKill();
  };

  return (
    <Panel>
      <h3>Admin Panel {isAdmin && <strong>(You are admin)</strong>}</h3>
      <button onClick={startSession} disabled={!connected}>
        Start session
      </button>
      <button
        onClick={killSession}
        style={{ background: "#ffdddd" }}
        disabled={!connected || !isAdmin}
      >
        Kill session
      </button>
    </Panel>
  );
};

export default AdminPanel;
