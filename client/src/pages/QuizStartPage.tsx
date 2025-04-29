import QuizActions from "../components/QuizActions";
import "../App.css";

const QuizStartPage = () => {
  // Managing users

  // Managing sessions
  //socket.on("session", onSession);
  //socket.on("sessionkilled", onSessionKilled);

  return (
    <>
      <div className="App">
        <QuizActions />{" "}
      </div>
    </>
  );
};

export default QuizStartPage;
