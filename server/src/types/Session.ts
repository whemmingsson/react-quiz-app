import User from "./User.js";

export default interface Session {
    id: string;
    users: User[];
}