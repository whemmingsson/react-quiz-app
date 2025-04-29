import User from "./user";



export default interface Session {
    quizName?: string; 
    id: string;
    users: User[];
}