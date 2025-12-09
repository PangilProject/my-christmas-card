import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import html2canvas from "html2canvas";
import ReactConfetti from "react-confetti";
import results from "../data/results.json";
import Snowfall from "../components/Snowfall";

// This is a type assertion to help TypeScript understand the structure of results.json
type ResultData = {
  [key: string]: {
    name: string;
    keyword: string;
    description: string;
    recommend: string;
    song: string;
    image: string;
  };
};

const typedResults: ResultData = results;

// A simple hook to get window dimensions
const useWindowSize = () => {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  useEffect(() => {
    const handleResize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return { width: size[0], height: size[1] };
};

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeInOut = keyframes`
  0%, 100% { opacity: 0; }
  20%, 80% { opacity: 1; }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #090a0f; /* Dark Night Sky */
  color: #fff8e7; /* Warm White */
  padding: 40px 20px;
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

const ResultCard = styled.div`
  background-color: #2d3e50; /* Darker card background */
  color: #fff8e7; /* Warm White text for contrast */
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  animation: ${slideUp} 0.7s ease-out;
  font-family: "IBM Plex Sans KR", sans-serif;
`;

const ResultImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 15px;
  margin-bottom: 20px;
  object-fit: cover;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #bdc3c7; /* Lighter grey for dark background */
  margin-bottom: 5px;
`;

const Title = styled.h1`
  font-family: "IBM Plex Sans KR", cursive;
  font-weight: bold; /* Adjusted for IBM Plex Sans KR */
  font-size: 2.5rem; /* Adjusted for IBM Plex Sans KR */
  color: #e63946; /* Primary Red */
  margin-top: 0;
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 30px;
`;

const RecommendBox = styled.div`
  background-color: rgba(0, 0, 0, 0.2); /* Darker transparent bg */
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 30px;
`;

const RecommendTitle = styled.h3`
  margin-top: 0;
  color: #2a9d8f; /* Christmas Green */
  font-family: "IBM Plex Sans KR", cursive;
  font-weight: bold; /* Adjusted for IBM Plex Sans KR */
  font-size: 1.2rem; /* Adjusted for IBM Plex Sans KR */
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
`;

const ActionButton = styled.button`
  font-size: 1.2rem;
  padding: 15px 30px;
  border-radius: 10px;
  border: none;
  background-color: #2a9d8f; /* Christmas Green */
  color: #fff8e7; /* Warm White */
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    background-color: #1e6f5c; /* Dark Green */
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
`;

const CopiedMessage = styled.div`
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #2a9d8f; /* Christmas Green */
  color: #fff8e7; /* Warm White */
  border-radius: 5px;
  animation: ${fadeInOut} 2s ease-in-out;
`;

function ResultPage() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);
  const [showCopiedMsg, setShowCopiedMsg] = useState(false);

  // Stop confetti after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  // Handle the case where type is undefined or not in results
  const result = type ? typedResults[type] : null;

  const handleSave = () => {
    if (!cardRef.current) return;

    html2canvas(cardRef.current, {
      backgroundColor: "#2d3e50", // Match card background
      useCORS: true,
    }).then((canvas) => {
      const link = document.createElement("a");
      link.download = "my-christmas-card.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowCopiedMsg(true);
    setTimeout(() => setShowCopiedMsg(false), 2000); // Hide message after 2 seconds
  };

  if (!result) {
    return (
      <Wrapper>
        <Snowfall />
        <Content>
          <Title style={{ color: "#FFF8E7" }}>결과를 찾을 수 없습니다.</Title>
          <ActionButton onClick={() => navigate("/")}>
            테스트 다시하기
          </ActionButton>
        </Content>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {showConfetti && (
        <ReactConfetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={400}
          colors={["#E63946", "#2A9D8F", "#D4A373", "#FFF8E7"]}
          style={{ zIndex: 30 }}
        />
      )}
      <Snowfall />
      <Content>
        <ResultCard ref={cardRef}>
          <Subtitle>나의 크리스마스 성향은...</Subtitle>
          <Title>{result.name}</Title>
          <ResultImage src={result.image} alt={result.name} />
          <Description>"{result.description}"</Description>

          <RecommendBox>
            <RecommendTitle>✨ 이런 활동은 어때요?</RecommendTitle>
            <p>{result.recommend}</p>
          </RecommendBox>

          <RecommendBox>
            <RecommendTitle>🎵 추천 캐롤</RecommendTitle>
            <p>{result.song}</p>
          </RecommendBox>
        </ResultCard>
        <ButtonGroup>
          <ActionButton onClick={() => navigate("/")}>
            테스트 다시하기
          </ActionButton>
          <ActionButton onClick={handleSave}>이미지 저장</ActionButton>
          <ActionButton onClick={handleCopyLink}>링크 복사</ActionButton>
        </ButtonGroup>
        {showCopiedMsg && <CopiedMessage>복사 완료!</CopiedMessage>}
      </Content>
    </Wrapper>
  );
}

export default ResultPage;
