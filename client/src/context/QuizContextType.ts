import { SessionStarted } from "@common/messages/SessionStarted";
import Quiz from "@common/Quiz";
import Session from "@common/Session";

export interface SocketActions {
  startSession: (message: SessionStarted) => void;
  joinSession: (message: SessionStarted) => void;
}

interface QuizContextType {
  isConnected: boolean;
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
  isJoined: boolean;
  setIsJoined: React.Dispatch<React.SetStateAction<boolean>>;
  clientId?: string;
  socketActions: SocketActions;
  isAdmin: boolean;
  sessionId: string;
  sessions: Session[];
  quizzes: Quiz[];
}

export default QuizContextType;
