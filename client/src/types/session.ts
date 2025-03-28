import { User } from "./user";

export interface QSession {
    id: string;
    users?: User[];
}