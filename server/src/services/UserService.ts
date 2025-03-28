import User from "../types/User";

class UserService {
    users: User[];
    /**
     *
     */
    constructor() {
        this.users = [];
    }
    public createUser(socketId:string):User {
        // Create user
        const user:User = {
            id: this.users.length,
            socketId: socketId,
            isAdmin: false,
        }
        // Add user to users
        this.users.push(user);
        return user;
    }

    public deleteUser(socketId:string):User | null {
        const userIndex = this.users.findIndex(u => u.socketId === socketId);
        if(userIndex !== -1){
            const user = this.users[userIndex];
            this.users.splice(userIndex, 1);
            return user;
        }
        return null;
    }

    public getUser(socketId:string):User | null {
        const user = this.users.find(u => u.socketId === socketId);
        if(user){
            return user;
        }
        return null;
    }

    public getUsers():User[] {
        return this.users;
    }
}

export default UserService;