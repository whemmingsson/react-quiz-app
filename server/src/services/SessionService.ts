import Session from "../types/Session";
import User from "../types/User";

class SessionService {
    sessions: Session[];
    /**
     *
     */
    constructor() {
        this.sessions = [];
    }

    public createSession(id:string):Session {
        // Create session
        const session:Session = {
            id: id,
            users: [],
        }
        // Add session to sessions
        this.sessions.push(session);
        return session;
    }

    public addAsAdmin(session:Session, user:User, userName:string):Session | null {
        user.isAdmin = true;
        user.name = userName;
        session.users.push(user);
        return session;
    }

    public addAsPlayer(sessionId:string, user:User, userName:string, clientId:string):Session | null {
        const session = this.sessions.find(s => s.id === sessionId);
        if(session){
            user.clientId = clientId;
            user.name = userName;
            session.users.push(user);
            return session;
        }
        return null;
    }

    public getSession(id:string):Session | null {
        const session = this.sessions.find(s => s.id === id);
        if(session){
            return session;
        }
        return null;
    }
    
    public getSessions():Session[] {
        return this.sessions;
    }

    public killSession(id:string):Session | null {
        const sessionIndex = this.sessions.findIndex(s => s.id === id);
        if(sessionIndex !== -1){
            const session = this.sessions[sessionIndex];
            this.sessions.splice(sessionIndex, 1);
            return session;
        }
        return null;
    }
    
}

export default SessionService;