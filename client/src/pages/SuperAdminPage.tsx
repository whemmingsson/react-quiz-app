import { useState } from "react";
import { socket } from "../socket";
import User from "@common/User";

interface ServerState {
  users: User[];
  //sessions: QSession[];
}

const SuperAdminPage = () => {
  const [serverUsers, setServerUsers] = useState<User[]>([]);
  const fetchServerState = () => {
    socket
      .timeout(3000)
      .emit("fetchserverstate", (err: unknown, data: ServerState) => {
        console.log(err, data);

        if (err) {
          console.error(err);
          return;
        }

        if (data && data.users) {
          setServerUsers(data.users);
        }
      });
  };

  return (
    <div>
      <button onClick={fetchServerState}>Fetch server state</button>

      <h3>Server state</h3>
      <div>
        <h4>Users</h4>
        <ul>
          {serverUsers.map((user) => (
            <li key={user.id}>
              {user.id} - {user.isAdmin ? "Admin" : "User"}{" "}
              <button>Kick</button>
            </li>
          ))}
        </ul>
      </div>
      <div></div>
      <div
        style={{
          background: "#ffdddd",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "5px",
        }}
      >
        <h3>Danger zone</h3>
        <button style={{ background: "#aa2222", color: "#fff" }}>
          💀 Purge 💀
        </button>
        <p>A purge will remove all quizzes, sessions and users</p>
        <p>Use with caution!</p>
      </div>
    </div>
  );
};

export default SuperAdminPage;
