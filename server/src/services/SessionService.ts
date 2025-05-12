import Session from "@common/Session";
import User from "@common/User";

class SessionService {
  sessions: Session[];
  /**
   *
   */
  constructor() {
    this.sessions = [];
  }

  public createSession(id: string, admin: User): Session {
    // Create session
    const session: Session = {
      id: id,
      users: [],
    };

    admin.isAdmin = true;
    session.users.push(admin);

    // Add session to sessions
    this.sessions.push(session);
    return session;
  }

  public rejoinSession(sessionId: string, clientId: string) {
    const session = this.sessions.find((s) => s.id === sessionId);
    if (session) {
      const user = session.users.find((u) => u.clientId === clientId);
      if (user) {
        return session;
      } else {
        console.error("User not found in session");
        return null;
      }
    } else {
      console.error("Session not found");
      return null;
    }
  }

  public addAsPlayer(sessionId: string, user: User): Session | null {
    const session = this.sessions.find((s) => s.id === sessionId);
    if (session) {
      session.users.push(user);
      return session;
    }
    return null;
  }

  public getSession(id: string): Session | null {
    const session = this.sessions.find((s) => s.id === id);
    if (session) {
      return session;
    }
    return null;
  }

  public getSessions(): Session[] {
    return this.sessions;
  }

  public killSession(id: string): Session | null {
    const sessionIndex = this.sessions.findIndex((s) => s.id === id);
    if (sessionIndex !== -1) {
      const session = this.sessions[sessionIndex];
      this.sessions.splice(sessionIndex, 1);
      return session;
    }
    return null;
  }

  public sessionExists(clientId: string): boolean {
    const session = this.sessions.find((s) => s.id === clientId);
    if (session) {
      return true;
    }
    return false;
  }

  public purgeSessions() {
    this.sessions = [];
  }
}

export default SessionService;
