import { createContext } from "react";
import QuizContextType from "./QuizContextType";

export const QuizContext = createContext<QuizContextType | undefined>(
  undefined
);
