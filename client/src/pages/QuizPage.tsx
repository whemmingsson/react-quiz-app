import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Quiz from "@common/Quiz";
import { getQuiz } from "../api/api";

const PageContainer = styled.div`
  max-width: 800px;
  margin: 70px auto 20px;
  padding: 0 16px;
`;

const QuizHeader = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const QuizTitle = styled.h1`
  margin-top: 0;
  color: #333;
  padding-bottom: 8px;
  margin-bottom: 16px;
  border-bottom: 2px solid #2196f3;
`;

const QuizInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const QuizMeta = styled.div`
  font-size: 0.95rem;
  color: #666;
`;

const QuizDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: #444;
  margin-bottom: 24px;
`;

const QuizContent = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const QuizStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 12px 16px;
  background-color: #e8f5fe;
  border-radius: 6px;
  color: #0277bd;
`;

const StartButton = styled.button`
  padding: 10px 24px;
  font-size: 1.1rem;
  font-weight: 600;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 16px;

  &:hover {
    background-color: #0d8aee;
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #d32f2f;
  background-color: #ffebee;
  border-radius: 8px;
`;

const QuizPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) {
        setError("Quiz ID is missing");
        return;
      }

      try {
        const quiz = await getQuiz(quizId ? parseInt(quizId, 10) : -1);
        if (!quiz) {
          throw new Error("Quiz not found");
        }
        setQuiz(quiz);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load quiz");
        console.error("Error fetching quiz:", err);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleStartQuiz = () => {
    // Implement quiz start logic here
    console.log("Starting quiz:", quizId);
  };

  if (error || !quiz) {
    return (
      <PageContainer>
        <ErrorMessage>{error || "Quiz not found"}</ErrorMessage>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <QuizHeader>
        <QuizTitle>{quiz.name}</QuizTitle>
        <QuizInfo>
          <QuizMeta>
            {quiz.questions.length} questions • Created{" "}
            {new Date(quiz.createdAt).toLocaleDateString()}
          </QuizMeta>
        </QuizInfo>
        <QuizDescription>
          This quiz contains {quiz.questions.length} questions about{" "}
          {quiz.name.toLowerCase()}. Test your knowledge and see how well you
          score!
        </QuizDescription>
      </QuizHeader>

      <QuizContent>
        <QuizStatus>
          <span>Ready to begin the quiz?</span>
          <span>{quiz.questions.length} questions to answer</span>
        </QuizStatus>

        <p>
          You'll have one attempt to answer each question. Your final score will
          be displayed at the end.
        </p>

        <StartButton onClick={handleStartQuiz}>Start Quiz</StartButton>
      </QuizContent>
    </PageContainer>
  );
};

export default QuizPage;
