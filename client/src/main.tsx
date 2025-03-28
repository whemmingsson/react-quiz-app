import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRoutes from "./Routes";
import { QuizContextProvider } from "./context/QuizContextProvider";
import { CookiesProvider } from "react-cookie";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CookiesProvider>
      <QuizContextProvider>
        <AppRoutes />
      </QuizContextProvider>
    </CookiesProvider>
  </StrictMode>
);
