import Session from "@common/session";
import { useState } from "react";
import { getActiveSessions, getQuizzes } from "../api/api";
import styled from "styled-components";
import Quiz from "@common/Quiz";

const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 70px auto 20px; /* Top margin to account for the fixed TopBar */
  padding: 0 16px;
`;

const ButtonsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, auto);
  }
`;

const ActionButton = styled.button<{ isActive?: boolean }>`
  padding: 20px;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  background-color: ${(props) => (props.isActive ? "#2196f3" : "#e0e0e0")};
  color: ${(props) => (props.isActive ? "white" : "#333")};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: ${(props) => (props.isActive ? "#1976d2" : "#d0d0d0")};
    transform: translateY(-2px);
  }
`;

const ContentSection = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SectionHeading = styled.h2`
  margin-top: 0;
  color: #333;
  border-bottom: 2px solid #2196f3;
  padding-bottom: 8px;
  margin-bottom: 16px;
`;

const SectionContent = styled.div`
  color: #555;
  line-height: 1.6;
`;

const StyledList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 16px 0;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 8px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

const ItemInfo = styled.div`
  flex-grow: 1;
`;

const ItemTitle = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const ItemDetail = styled.div`
  font-size: 0.85rem;
  color: #666;
`;

const ActionButtonSmall = styled.button`
  padding: 6px 12px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0d8aee;
  }
`;

type ActionType = "join" | "start" | "create" | "admin" | null;

const QuizActions = () => {
  // Layout
  const [activeSection, setActiveSection] = useState<ActionType>(null);
  const handleButtonClick = (
    section: ActionType,
    additionalAction?: () => void
  ) => {
    setActiveSection(section === activeSection ? null : section);
    if (additionalAction) {
      additionalAction();
    }
  };

  // Functionality
  const [sessions, setSessions] = useState<Session[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  const fetchSessions = async () => {
    try {
      const activeSessions = await getActiveSessions();
      setSessions(activeSessions);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const quizzes = await getQuizzes();
      setQuizzes(quizzes);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ActionsContainer>
      <ButtonsGrid>
        <ActionButton
          isActive={activeSection === "join"}
          onClick={() => handleButtonClick("join", fetchSessions)}
        >
          Join Quiz
        </ActionButton>
        <ActionButton
          isActive={activeSection === "start"}
          onClick={() => handleButtonClick("start", fetchQuizzes)}
        >
          Start Quiz
        </ActionButton>
        <ActionButton
          isActive={activeSection === "create"}
          onClick={() => handleButtonClick("create")}
        >
          Create Quiz
        </ActionButton>
        <ActionButton
          isActive={activeSection === "admin"}
          onClick={() => handleButtonClick("admin")}
        >
          Admin
        </ActionButton>
      </ButtonsGrid>

      {activeSection && (
        <ContentSection>
          {activeSection === "join" && (
            <>
              <SectionHeading>Join Quiz</SectionHeading>
              <SectionContent>
                <p>Enter a quiz code to join an existing quiz session.</p>
                <p>
                  You'll be able to participate and submit answers once
                  connected.
                </p>
                <p>
                  {sessions.length === 0}
                  <strong>No active sessions available.</strong>
                </p>

                {sessions.length > 0 && (
                  <>
                    <strong>Active Sessions:</strong>
                    <StyledList>
                      {sessions.map((session) => (
                        <ListItem key={session.id}>
                          <ItemInfo>
                            <ItemTitle>{session.quizName}</ItemTitle>
                            <ItemDetail>Session ID: {session.id}</ItemDetail>
                          </ItemInfo>
                          <ActionButtonSmall>Join</ActionButtonSmall>
                        </ListItem>
                      ))}
                    </StyledList>
                  </>
                )}
              </SectionContent>
            </>
          )}

          {activeSection === "start" && (
            <>
              <SectionHeading>Start Quiz</SectionHeading>
              <SectionContent>
                <p>Start a new quiz session from your available quizzes.</p>

                {quizzes.length === 0 && (
                  <p>
                    <strong>No quizzes available.</strong>
                  </p>
                )}

                {quizzes.length > 0 && (
                  <>
                    <strong>Available Quizzes:</strong>
                    <StyledList>
                      {quizzes.map((quiz) => (
                        <ListItem key={quiz.id}>
                          <ItemInfo>
                            <ItemTitle>{quiz.name}</ItemTitle>
                            <ItemDetail>
                              {quiz.questions.length} questions
                            </ItemDetail>
                          </ItemInfo>
                          <ActionButtonSmall>Start</ActionButtonSmall>
                        </ListItem>
                      ))}
                    </StyledList>
                  </>
                )}
              </SectionContent>
            </>
          )}

          {activeSection === "create" && (
            <>
              <SectionHeading>Create Quiz</SectionHeading>
              <SectionContent>
                <p>Create a new quiz with custom questions and answers.</p>
                <p>
                  You can add multiple choice questions, true/false, and more.
                </p>
              </SectionContent>
            </>
          )}

          {activeSection === "admin" && (
            <>
              <SectionHeading>Admin Panel</SectionHeading>
              <SectionContent>
                <p>Manage users, quizzes, and system settings.</p>
                <p>
                  Administrative privileges are required to access this section.
                </p>
              </SectionContent>
            </>
          )}
        </ContentSection>
      )}
    </ActionsContainer>
  );
};

export default QuizActions;
