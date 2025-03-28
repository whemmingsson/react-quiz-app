import UserLabel from "./UserLabel";

const ConnectedUsers = ({ users }: { users: string[] }) => {
  return (
    <>
      {users.length > 0 && <p>Connected users:</p>}
      {users.map((u) => {
        return <UserLabel guid={u} key={u} />;
      })}
    </>
  );
};

export default ConnectedUsers;
