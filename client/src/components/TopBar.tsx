import { useContext, useState } from "react";
import styled from "styled-components";
import { socket } from "../socket";
import { QuizContext } from "../context/QuizContext";

const TopBarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ddd;
  font-size: 0.9rem;
  height: 50px;
  box-sizing: border-box;
`;

const InfoSection = styled.div`
  display: flex;
  gap: 20px;
`;

const InfoItem = styled.div`
  strong {
    margin-right: 4px;
  }
`;

const ButtonSection = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button`
  padding: 4px 8px;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const ReconnectButton = styled(Button)`
  background-color: #4caf50;
`;

const DisconnectButton = styled(Button)`
  background-color: #f44336;
`;

const UsernameInput = styled.input`
  max-width: 120px;
  padding: 4px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const TopBar = () => {
  const { clientId, isConnected, setIsConnected } =
    useContext(QuizContext) ?? {};
  const [username, setUsername] = useState<string>("Anonymous");

  const handleReconnect = () => {
    // Simple page refresh will trigger socket reconnection
    window.location.reload();
  };

  const handleDisconnect = () => {
    // Notify server before disconnecting
    socket.emit("manual-disconnect", clientId, () => {
      // Disconnect the socket after server acknowledges
      socket.disconnect();
      if (setIsConnected) setIsConnected(false);
    });
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  return (
    <TopBarContainer>
      <InfoSection>
        <InfoItem>
          <strong>Status:</strong>{" "}
          {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
        </InfoItem>
        <InfoItem>
          <strong>Socket ID:</strong> {socket.id || "Not connected"}
        </InfoItem>
        <InfoItem>
          <strong>Client ID:</strong> {clientId || "Not assigned"}
        </InfoItem>
        <InfoItem>
          <UsernameInput
            type="text"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Username"
          />
        </InfoItem>
      </InfoSection>

      <ButtonSection>
        <ReconnectButton onClick={handleReconnect}>Reconnect</ReconnectButton>
        <DisconnectButton onClick={handleDisconnect}>
          Disconnect
        </DisconnectButton>
      </ButtonSection>
    </TopBarContainer>
  );
};

export default TopBar;
