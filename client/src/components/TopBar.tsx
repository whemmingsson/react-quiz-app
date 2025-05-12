import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { socket } from "../socket";
import { QuizContext } from "../context/QuizContext";
import { saveUsername } from "../api/api";

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
  display: flex;
  align-items: center;
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

const HomeButton = styled(Button)`
  background-color: #2196f3;
`;

const UsernameInput = styled.input`
  max-width: 120px;
  padding: 4px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const SaveButton = styled(Button)`
  background-color: #2196f3;
  margin-left: 4px;
`;

const UsernameContainer = styled.div`
  display: flex;
  align-items: center;
`;

const TopBar = () => {
  const { clientId, isConnected, setIsConnected, sessionId, isAdmin } =
    useContext(QuizContext) ?? {};
  const [username, setUsername] = useState<string>("Anonymous");
  const [isSaving, setIsSaving] = useState(false);

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

  // Load username from session storage when component mounts
  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSaveUsername = async () => {
    if (!isConnected || !clientId || !username.trim()) {
      return;
    }

    setIsSaving(true);
    try {
      await saveUsername(clientId, username.trim());
      // Save username to session storage
      sessionStorage.setItem("username", username.trim());
      console.log("Username saved successfully");
    } catch (error) {
      console.error("Error saving username:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <TopBarContainer>
      <InfoSection>
        <InfoItem>
          <HomeButton onClick={() => (window.location.href = "/")}>
            Home
          </HomeButton>
        </InfoItem>
        <InfoItem>
          <strong>Socket ID:</strong> {socket.id || "Not connected"}
        </InfoItem>
        <InfoItem>
          <strong>Client ID:</strong> {clientId || "Not assigned"}
        </InfoItem>
        {sessionId && (
          <InfoItem>
            <strong>Session ID:</strong> {sessionId}
          </InfoItem>
        )}
        {sessionId && (
          <InfoItem>
            <strong>Role: </strong> {isAdmin ? "Admin" : "Player"}
          </InfoItem>
        )}
        <InfoItem>
          <UsernameContainer>
            <UsernameInput
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Username"
              disabled={!isConnected || !clientId}
            />
            <SaveButton
              onClick={handleSaveUsername}
              disabled={!isConnected || !clientId || isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </SaveButton>
          </UsernameContainer>
        </InfoItem>
      </InfoSection>

      <ButtonSection>
        <InfoItem>
          <strong>Status:</strong>{" "}
          {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
        </InfoItem>
        <ReconnectButton onClick={handleReconnect}>Reconnect</ReconnectButton>
        <DisconnectButton onClick={handleDisconnect}>
          Disconnect
        </DisconnectButton>
      </ButtonSection>
    </TopBarContainer>
  );
};

export default TopBar;
