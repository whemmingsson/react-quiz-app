import { socket } from "../socket";

interface FirstVisitModalProps {
  ref: React.RefObject<HTMLDialogElement | null> | null;
  setCookie: (value: object) => void;
}

const FirstVisitModal = ({ ref, setCookie }: FirstVisitModalProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const username = data.get("username");
    const clientId = data.get("clientId");
    setCookie({ username: username ?? clientId, clientId });
    ref?.current?.close();
  };

  return (
    <dialog ref={ref}>
      <div>
        <h2>Welcome to Fin Quiz!</h2>
        <p>
          It looks like this is your first visit. Please enter a preffered
          username to get started.
        </p>

        <form onSubmit={handleSubmit}>
          <input type="text" name="username" />
          <input
            type="text"
            value={socket.id}
            name="clientId"
            readOnly={true}
          />
          <input type="submit" value={"Submit"} />
        </form>
      </div>
    </dialog>
  );
};

export default FirstVisitModal;
