import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ref, runTransaction } from "firebase/database";
import { database } from "../firebase";
import questions from "../data/questions.json";
import Snowfall from "../components/Snowfall";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #090a0f; /* Dark Night Sky */
  color: #fff8e7; /* Warm White */
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden; /* Hide overflowing snowflakes */
  position: relative; /* Positioning context for Snowfall */
`;

const Content = styled.div`
  position: relative;
  z-index: 20; /* Ensure content is above snowflakes */
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const ProgressBarContainer = styled.div`
  width: 80%;
  max-width: 500px;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.2); /* Darker transparent */
  border-radius: 10px;
  margin-bottom: 40px;
  overflow: hidden;
  border: 1px solid #d4a373;
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: ${(props) => props.progress}%;
  height: 100%;
  background-color: #e63946; /* Primary Red */
  transition: width 0.3s ease-in-out;
`;

const QuestionContainer = styled.div`
  text-align: center;
  width: 100%;
`;

const QuestionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 40px;
`;

const AnswerButton = styled.button`
  display: block;
  width: 100%;
  max-width: 500px;
  font-size: 1.2rem;
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 10px;
  border: 2px solid #d4a373; /* Gold Accent */
  background-color: transparent;
  color: #fff8e7; /* Warm White */
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
  margin-left: auto;
  margin-right: auto;

  &:hover {
    background-color: rgba(212, 163, 115, 0.1); /* Gold Accent transparent */
    transform: scale(1.03);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const totalQuestions = questions.length;

function QuestionPage() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const navigate = useNavigate();

  const handleAnswerClick = async (type: string) => {
    // 점수 업데이트
    const newScores = { ...scores };
    newScores[type] = (newScores[type] || 0) + 1;
    setScores(newScores);

    // 다음 질문으로 이동 또는 결과 페이지로 이동
    if (questionIndex < totalQuestions - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      // 최종 결과 계산
      const resultType = Object.keys(newScores).reduce((a, b) =>
        newScores[a] > newScores[b] ? a : b
      );

      const hasParticipated = sessionStorage.getItem("hasParticipated");
      if (!hasParticipated) {
        const countRef = ref(database, "participantCount");
        const result = await runTransaction(countRef, (currentCount) => {
          return (currentCount || 0) + 1;
        });

        if (result.committed) {
          const userNumber = result.snapshot.val();
          sessionStorage.setItem("hasParticipated", "true");
          navigate(`/result/${resultType}?userNumber=${userNumber}`);
        } else {
          navigate(`/result/${resultType}`); // 트랜잭션 실패 시에도 이동
        }
      } else {
        navigate(`/result/${resultType}`);
      }
    }
  };

  const currentQuestion = questions[questionIndex];
  const progress = ((questionIndex + 1) / totalQuestions) * 100;

  return (
    <Wrapper>
      <Snowfall />
      <Content>
        <ProgressBarContainer>
          <ProgressBar progress={progress} />
        </ProgressBarContainer>
        <QuestionContainer>
          <QuestionTitle>{currentQuestion.question}</QuestionTitle>
          {currentQuestion.answers.map((answer, index) => (
            <AnswerButton
              key={index}
              onClick={() => handleAnswerClick(answer.type)}
            >
              {answer.text}
            </AnswerButton>
          ))}
        </QuestionContainer>
      </Content>
    </Wrapper>
  );
}

export default QuestionPage;
