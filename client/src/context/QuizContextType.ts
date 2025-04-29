interface QuizContextType {
    isConnected: boolean;
    setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
    isJoined: boolean;
    setIsJoined: React.Dispatch<React.SetStateAction<boolean>>;
    clientId?: string;
};

export default QuizContextType;