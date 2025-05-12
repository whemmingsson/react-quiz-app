import { useLocation } from "react-router-dom";

const useSession = () => {
  // Inside your component:
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);
  const sessionIdFromPath = pathParts[0]; // Assuming sessionId is the first path segment

  if (sessionIdFromPath) {
    // Check if the sessionId is valid (you can add more validation if needed)
    const isValidSessionId = /^[a-zA-Z0-9-]+$/.test(sessionIdFromPath);
    if (isValidSessionId) {
      return sessionIdFromPath;
    }
  }

  return null;
};

export default useSession;
