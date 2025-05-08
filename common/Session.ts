import User from "./User";


export default interface Session {
    quizName?: string; 
    id: string;
    users: User[];
}