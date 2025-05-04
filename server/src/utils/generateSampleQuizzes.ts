
import Quiz from "@common/Quiz";
import { v4 as uuidv4 } from "uuid";

/**
 * Creates sample quizzes for testing and development
 * @returns Array of sample Quiz objects
 */
 const generateSampleQuizzes = (): Quiz[] => {
  const now = new Date();
  
  // Sample Quiz 1: General Knowledge
  const generalKnowledgeQuiz: Quiz = {
    id:"0",
    name: "General Knowledge Quiz",
    questions: [
      {
        id: uuidv4(),
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctOptionIndex: 2, // Paris
      },
      {
        id: uuidv4(),
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctOptionIndex: 1, // Mars
      },
      {
        id: uuidv4(),
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        correctOptionIndex: 3, // Pacific Ocean
      }
    ],
    createdAt: now,
    updatedAt: now
  };
  
  // Sample Quiz 2: Programming Basics
  const programmingQuiz: Quiz = {
    id: "1",
    name: "Programming Basics",
    questions: [
      {
        id: uuidv4(),
        question: "Which language is used primarily for styling web pages?",
        options: ["HTML", "JavaScript", "CSS", "Python"],
        correctOptionIndex: 2, // CSS
      },
      {
        id: uuidv4(),
        question: "What does DOM stand for in web development?",
        options: [
          "Document Object Model", 
          "Data Object Management", 
          "Digital Ordinance Module", 
          "Desktop Object Mode"
        ],
        correctOptionIndex: 0, // Document Object Model
      },
      {
        id: uuidv4(),
        question: "Which of these is NOT a JavaScript framework or library?",
        options: ["React", "Angular", "Vue", "Flask"],
        correctOptionIndex: 3, // Flask (it's a Python framework)
      }
    ],
    createdAt: now,
    updatedAt: now
  };
  
  return [generalKnowledgeQuiz, programmingQuiz];
}

export default generateSampleQuizzes;