
export default interface User {
    id: number; // Unique identifier
    socketId: string; // Socket.io socket id
    clientId?: string; // Unique identifier for the client
    isAdmin?: boolean; // Is the user an admin in the session
    name?: string; // The user's name
}