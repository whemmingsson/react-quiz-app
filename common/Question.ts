export default interface Question {
    id: string; // Unique identifier for the question
    question: string; // The text of the question
    options: string[]; // Array of possible answers
    correctOptionIndex: number; // The correct answer to the question
    explanation?: string; // Optional explanation for the correct answer
    createdAt?: Date; // Timestamp when the question was created
    updatedAt?: Date; // Timestamp when the question was last updated
}