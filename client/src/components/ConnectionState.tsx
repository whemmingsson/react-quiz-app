import styled from "styled-components";

const StyledState = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 10px;
  align-items: center;
  margin-top: 20px;
  background-color: #f0f0f0;
`;

export const ConnectionState = ({
  isConnected,
  isJoined,
}: {
  isConnected: boolean;
  isJoined: boolean;
}) => {
  return (
    <>
      <StyledState>
        <p>Connected: {isConnected ? "✔️" : <>❌</>}</p>
        <p>Joined session: {isJoined ? "✔️" : "❌"}</p>
      </StyledState>
      <p>
        <em>
          Note: If disconnected, a re-connect does not auto-join the session
          again
        </em>
      </p>
    </>
  );
};
