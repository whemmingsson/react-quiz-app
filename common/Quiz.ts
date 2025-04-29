import Question from "./Question";

export default interface Quiz {
    id: string; // Unique identifier for the quiz
    name: string; // Name of the quiz
    questions: Question[]; // Array of questions in the quiz
    createdAt: Date; // Timestamp when the quiz was created
    updatedAt: Date; // Timestamp when the quiz was last updated
}