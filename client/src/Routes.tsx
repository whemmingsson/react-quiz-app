import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import SuperAdminPage from "./pages/SuperAdminPage";
import QuizStartPage from "./pages/QuizStartPage";
import Layout from "./Layout";
import QuizPage from "./pages/QuizPage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/SuperAdmin" element={<SuperAdminPage />} />
          <Route path="/" element={<QuizStartPage />} />
          <Route path="/quiz/:quizId" element={<QuizPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
