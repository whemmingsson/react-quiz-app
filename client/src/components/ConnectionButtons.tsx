import styled from "styled-components";
import { socket } from "../socket";
import { QuizContext } from "../context/QuizContext";
import { useContext } from "react";

const Row = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px 20px 20px 20px;
  position: fixed;
  justify-content: flex-end;
  background-color: #f0f0f0;
  width: calc(100% - 40px);
  top: 0;
  left: 0;
`;

const ConnectionButtons = () => {
  const ctx = useContext(QuizContext);

  const reconnect = () => {
    if (socket.connected) ctx?.setIsConnected(true);
    else window.location.reload();
  };

  const disconnect = () => {
    socket.disconnect();
    ctx?.setIsConnected(false);
  };

  return (
    <Row>
      Connected? {ctx?.isConnected ? "✔️" : "❌"}
      <button
        onClick={reconnect}
        disabled={ctx?.isConnected}
        style={{ background: "#ddffdd" }}
      >
        Reconnect
      </button>
      <button
        onClick={disconnect}
        style={{ background: "#ffdddd" }}
        disabled={!ctx?.isConnected}
      >
        Disconnect
      </button>
    </Row>
  );
};

export default ConnectionButtons;
