import Session from "@common/Session";
import User from "@common/User";

export interface UserJoinedSessionData {
    session: Session;
    user: User;
}