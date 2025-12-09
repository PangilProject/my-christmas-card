import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";
import Snowfall from "../components/Snowfall";

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
  color: #fff8e7; /* Warm White */
  text-align: center;
  overflow: hidden; /* Hide overflowing snowflakes */
  position: relative; /* Positioning context for Snowfall */
  padding: 20px;
  box-sizing: border-box;
  padding-bottom: 100px;
`;

const Content = styled.div`
  position: relative;
  z-index: 20; /* Ensure content is above snowflakes */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Graphic = styled.div`
  width: 120px;
  height: 120px;
  margin-bottom: 30px;
  animation: ${float} 4s ease-in-out infinite;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const Title = styled.h1`
  font-family: "Mountains of Christmas", cursive;
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: #fff8e7; /* Warm White */
  text-shadow: 0 0 10px #d4a373, 0 0 15px #d4a373; /* Gold Accent Shadow */
`;

const Description = styled.p`
  font-size: 1.2rem;
  margin-bottom: 20px; /* Adjusted margin */
  max-width: 400px;
  line-height: 1.5;
  color: #fff8e7; /* Warm White */
`;

const Input = styled.input`
  font-family: "IBM Plex Sans KR", sans-serif;
  font-size: 1.2rem;
  padding: 10px 15px;
  margin-bottom: 30px;
  border-radius: 8px;
  border: 2px solid #d4a373; /* Gold Accent */
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff8e7;
  text-align: center;
  width: 80%;
  max-width: 300px;

  &::placeholder {
    color: #bdc3c7;
  }
  &:focus {
    outline: none;
    border-color: #e63946; /* Primary Red */
  }
`;

const StartButton = styled.button`
  font-family: "Mountains of Christmas", cursive;
  font-size: 2rem;
  font-weight: 700;
  padding: 15px 40px;
  border-radius: 50px;
  border: none;
  background-color: #e63946; /* Primary Red */
  color: #fff8e7; /* Warm White */
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease,
    box-shadow 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  &:disabled {
    background-color: #555;
    cursor: not-allowed;
    opacity: 0.7;
  }

  &:hover:not(:disabled) {
    background-color: #b5171a; /* Dark Red Accent */
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
`;

const ParticipantCounter = styled.p`
  margin-top: 20px;
  margin-bottom: 40px;
  font-size: 1.5rem;
  color: #d4a373; /* Gold Accent */
`;

// Simple SVG Gift Box Component
const GiftBoxIcon = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <path fill="#E63946" /* Primary Red */ d="M10 30 H 90 V 90 H 10 Z" />
    <path fill="#D4A373" /* Gold Accent */ d="M45 10 H 55 V 90 H 45 Z" />
    <path fill="#D4A373" /* Gold Accent */ d="M10 45 H 90 V 55 H 10 Z" />
    <path
      fill="#D4A373" /* Gold Accent */
      d="M45 10 C 40 0, 20 0, 25 15 C 30 30, 45 20, 45 10 Z"
    />
    <path
      fill="#D4A373" /* Gold Accent */
      d="M55 10 C 60 0, 80 0, 75 15 C 70 30, 55 20, 55 10 Z"
    />
  </svg>
);

function LandingPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [participantCount, setParticipantCount] = useState<number | null>(null);

  useEffect(() => {
    const countRef = ref(database, "participantCount");
    onValue(countRef, (snapshot) => {
      const data = snapshot.val();
      setParticipantCount(data);
    });
  }, []);

  const handleStart = () => {
    if (userName.trim()) {
      sessionStorage.setItem("userName", userName.trim());
      sessionStorage.removeItem("hasParticipated"); // Reset participation flag
      navigate("/question");
    }
  };

  return (
    <Wrapper>
      <Snowfall />
      <Content>
        <Graphic>
          <GiftBoxIcon />
        </Graphic>
        <Title>My Christmas MBTI</Title>
        <Description>
          간단한 테스트를
          <br />
          통해 당신의 크리스마스 스타일을 알아보고,
          <br />
          어울리는 활동과 캐롤을 추천받아 보세요!
        </Description>

        {participantCount !== null && (
          <ParticipantCounter>
            지금까지 {participantCount.toLocaleString()}명이 참여했어요!
          </ParticipantCounter>
        )}
        <Input
          type="text"
          placeholder="이름을 입력해주세요!"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && userName.trim()) {
              handleStart();
            }
          }}
        />
        <StartButton onClick={handleStart} disabled={!userName.trim()}>
          START
        </StartButton>
      </Content>
    </Wrapper>
  );
}

export default LandingPage;
