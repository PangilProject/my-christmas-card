import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Snowfall from '../components/Snowfall';

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
  color: #FFF8E7; /* Warm White */
  text-align: center;
  overflow: hidden; /* Hide overflowing snowflakes */
  position: relative; /* Positioning context for Snowfall */
  padding: 20px;
  box-sizing: border-box;
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
  font-family: 'Mountains of Christmas', cursive;
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: #FFF8E7; /* Warm White */
  text-shadow: 0 0 10px #D4A373, 0 0 15px #D4A373; /* Gold Accent Shadow */
`;

const Description = styled.p`
  font-size: 1.2rem;
  margin-bottom: 40px;
  max-width: 400px;
  line-height: 1.5;
  color: #FFF8E7; /* Warm White */
`;

const StartButton = styled.button`
  font-family: 'Mountains of Christmas', cursive;
  font-size: 2rem;
  font-weight: 700;
  padding: 15px 40px;
  border-radius: 50px;
  border: none;
  background-color: #E63946; /* Primary Red */
  color: #FFF8E7; /* Warm White */
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #B5171A; /* Dark Red Accent */
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
`;

// Simple SVG Gift Box Component
const GiftBoxIcon = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="#E63946" /* Primary Red */
      d="M10 30 H 90 V 90 H 10 Z"
    />
    <path
      fill="#D4A373" /* Gold Accent */
      d="M45 10 H 55 V 90 H 45 Z"
    />
    <path
      fill="#D4A373" /* Gold Accent */
      d="M10 45 H 90 V 55 H 10 Z"
    />
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

  const handleStart = () => {
    navigate('/question');
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
          간단한 테스트를 통해 당신의 크리스마스 성향을 알아보고,<br/>
          어울리는 활동과 캐롤을 추천받아 보세요!
        </Description>
        <StartButton onClick={handleStart}>START</StartButton>
      </Content>
    </Wrapper>
  );
}

export default LandingPage;