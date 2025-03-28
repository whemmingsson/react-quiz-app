import { useState, useEffect, useContext, createRef, useCallback } from "react";
import { socket } from "../socket";
import { ConnectionManager } from "../components/ConnectionManager";
import { ConnectionState } from "../components/ConnectionState";
import ConnectedUsers from "../components/ConnectedUsers";
import AdminPanel from "../components/AdminPanel";
import "../App.css";
import { QuizContext } from "../context/QuizContext";
import FirstVisitModal from "../components/FirstVisitModal";
import { useCookies } from "react-cookie";

const QuizStartPage = () => {
  const ctx = useContext(QuizContext);
  const [socketId, setSocketId] = useState<string | null>(null);
  const [users, setUsers] = useState<string[]>([]);
  const [sessions, setSessions] = useState<string[]>([]);
  const [session, setSession] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const ref = createRef<HTMLDialogElement>();
  const [cookies, setCookie] = useCookies(["user"]);

  const handleSetCookie = useCallback(
    (value: object) => {
      setCookie("user", value, { path: "/" });
    },
    [setCookie]
  );

  useEffect(() => {
    if (!cookies.user) {
      ref.current?.showModal();
    }
  }, [cookies.user, ref]);

  useEffect(() => {
    const onConnect = () => {
      let userCookie = cookies.user;
      if (!userCookie) {
        userCookie = { id: socket.id };
        handleSetCookie(userCookie);
      } else {
        userCookie.clientId = socket.id;
        handleSetCookie(userCookie);
      }
    };

    const onDisconnect = () => {
      ctx?.setIsConnected(false);
    };

    const onUserJoined = (value: string) => {
      const next = [...users, value];
      setUsers(next);
    };

    const onDisconnectedUser = (value: string) => {
      const idx = users.indexOf(value);
      if (idx >= 0) {
        const next = [...users];
        next.splice(idx, 1);
        setUsers(next);
      } else {
        console.log("Could not remove user from local state");
      }
    };

    const onSession = (value: string) => {
      const next = [...sessions, value];
      setSessions(next);
    };

    const onSessionKilled = (value: string) => {
      console.log("Session killed", value);
      const idx = sessions.indexOf(value);
      if (idx >= 0) {
        const next = [...sessions];
        next.splice(idx, 1);
        setSessions(next);
      }
      setSession(null);
      ctx?.setIsJoined(false);
    };

    if (socket.id) {
      setSocketId(socket.id);
    }

    // Managing users
    socket.on("connect", onConnect);
    socket.on("userjoined", onUserJoined);
    socket.on("disconnect", onDisconnect);
    socket.on("userdisconnect", onDisconnectedUser);

    // Managing sessions
    socket.on("session", onSession);
    socket.on("sessionkilled", onSessionKilled);

    return () => {
      socket.off("connect", onConnect);
      socket.off("userjoined", onUserJoined);
      socket.off("disconnect", onDisconnect);
      socket.off("userdisconnect", onDisconnectedUser);
      socket.off("sessionkilled", onSessionKilled);
    };
  }, [
    users,
    ctx?.isJoined,
    ctx?.isConnected,
    sessions,
    cookies.user,
    ctx,
    handleSetCookie,
  ]);

  return (
    <>
      <div className="App">
        {/* Admin panel is used to create sessions */}
        <AdminPanel
          socketId={socketId}
          isAdmin={isAdmin}
          session={session || ""}
          connected={ctx?.isConnected ?? false}
          handleOnStart={() => {
            setSession(socketId);
            setIsAdmin(true);
            ctx?.setIsJoined(true);
          }}
          handleOnKill={() => {
            setIsAdmin(false);
            ctx?.setIsJoined(false);
            setUsers([]);
            setSession(null);
          }}
        />

        <p>Your id: {socketId}</p>
        {session && <p>Your session: {session}</p>}

        {/* ConnectedUsers component shows all connected users */}
        <ConnectedUsers users={users} />

        {/* ConnectionState component shows the connection and session state */}
        <ConnectionState
          isConnected={ctx?.isConnected ?? false}
          isJoined={ctx?.isJoined ?? false}
        />

        {/* ConnectionManager component is used to join sessions */}
        <ConnectionManager
          sessions={sessions}
          socketId={socketId ?? ""}
          isConnected={ctx?.isConnected ?? false}
          isJoined={ctx?.isJoined ?? false}
          handleJoin={ctx?.setIsJoined ?? (() => {})}
          handleConnect={ctx?.setIsConnected ?? (() => {})}
          handleSession={setSession}
        />
        <button onClick={() => ref.current?.showModal()}>Show modal</button>
      </div>
      <FirstVisitModal ref={ref} setCookie={handleSetCookie} />
    </>
  );
};

export default QuizStartPage;
