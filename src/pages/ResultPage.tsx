import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import html2canvas from "html2canvas";
import ReactConfetti from "react-confetti";
import results from "../data/results.json";
import Snowfall from "../components/Snowfall";

// CCapture.js 타입 정의
declare global {
  interface Window {
    CCapture: any;
  }
}

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
  background-color: #090a0f;
  color: #fff8e7;
  padding: 40px 20px;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
`;

const Content = styled.div`
  position: relative;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const ResultCard = styled.div`
  background-color: #2d3e50;
  color: #fff8e7;
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
  color: #bdc3c7;
  margin-bottom: 5px;
`;

const Title = styled.h1`
  font-family: "IBM Plex Sans KR", cursive;
  font-weight: bold;
  font-size: 2.5rem;
  color: #e63946;
  margin-top: 0;
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 30px;
`;

const RecommendBox = styled.div`
  background-color: #212f3c;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 30px;
`;

const RecommendTitle = styled.h3`
  margin-top: 0;
  color: #2a9d8f;
  font-family: "IBM Plex Sans KR", cursive;
  font-weight: bold;
  font-size: 1.2rem;
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
  background-color: #2a9d8f;
  color: #fff8e7;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease,
    box-shadow 0.2s ease;

  &:disabled {
    background-color: #555;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #1e6f5c;
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
`;

const CopiedMessage = styled.div`
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #2a9d8f;
  color: #fff8e7;
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
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  const result = type ? typedResults[type] : null;

  // 정적 이미지 저장 (고해상도 유지)
  const handleSave = async () => {
    const cardElement = cardRef.current;
    if (!cardElement) return;

    // 고스트 현상 방지: 스타일 강제 초기화
    const originalAnimation = cardElement.style.animation;
    const originalTransform = cardElement.style.transform;
    const originalOpacity = cardElement.style.opacity;

    cardElement.style.animation = "none";
    cardElement.style.transform = "none";
    cardElement.style.opacity = "1";

    try {
      const canvas = await html2canvas(cardElement, {
        backgroundColor: "#2d3e50",
        useCORS: true,
        scale: 2, // 이미지는 고화질(2배) 유지
      });

      const link = document.createElement("a");
      link.download = "my-christmas-card.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("이미지 저장 실패:", error);
    } finally {
      cardElement.style.animation = originalAnimation;
      cardElement.style.transform = originalTransform;
      cardElement.style.opacity = originalOpacity;
    }
  };

  // GIF 저장 (용량 최적화 + 레이아웃 보정)
  const handleSaveGif = async () => {
    const cardElement = cardRef.current;
    if (!cardElement || isCapturing) return;

    setIsCapturing(true);

    // 1. 고스트 방지용 스타일 초기화
    const originalAnimation = cardElement.style.animation;
    const originalTransform = cardElement.style.transform;
    const originalOpacity = cardElement.style.opacity;

    cardElement.style.animation = "none";
    cardElement.style.transform = "none";
    cardElement.style.opacity = "1";

    try {
      // 2. 캡처 설정
      // [중요] 레이아웃 깨짐 방지를 위해 scale을 1.5로 설정 (1은 너무 낮고, 2는 용량이 큼)
      const gifScale = 1.5;

      const cardCanvas = await html2canvas(cardElement, {
        backgroundColor: "#2d3e50",
        useCORS: true,
        scale: gifScale,
        scrollX: 0,
        scrollY: -window.scrollY, // 스크롤 위치 보정
      });

      const offscreenCanvas = document.createElement("canvas");
      offscreenCanvas.width = cardCanvas.width;
      offscreenCanvas.height = cardCanvas.height;
      const ctx = offscreenCanvas.getContext("2d")!;

      // 3. 눈 효과 설정 (해상도에 맞춰 크기/속도 조절)
      const snowflakes = Array.from({ length: 60 }, () => ({
        x: Math.random() * offscreenCanvas.width,
        y: Math.random() * offscreenCanvas.height,
        // scale이 커지면 눈도 같이 커져야 자연스러움
        radius: (Math.random() * 2 + 1) * (gifScale * 0.7),
        // 떨어지는 속도: 약간 빠르게
        speed: (Math.random() * 2 + 3) * (gifScale * 0.7),
      }));

      // 4. GIF 인코더 설정 (용량 감소의 핵심)
      // FPS를 15로 낮춤 (눈 내리는 효과는 이걸로 충분)
      const fps = 15;
      const capturer = new window.CCapture({
        format: "gif",
        workersPath: "/",
        verbose: false,
        framerate: fps,
        quality: 10,
      });

      capturer.start();

      // 5. 녹화 (시간 단축: 2초)
      const durationSec = 2;
      const totalFrames = durationSec * fps; // 총 30프레임 (기존 90프레임 대비 1/3)

      for (let i = 0; i < totalFrames; i++) {
        // 배경(카드) 그리기
        ctx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
        ctx.drawImage(cardCanvas, 0, 0);

        // 눈 그리기
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        snowflakes.forEach((flake) => {
          flake.y += flake.speed;

          // 화면 아래로 나가면 위로 리셋
          if (flake.y > offscreenCanvas.height) {
            flake.y = -flake.radius;
            flake.x = Math.random() * offscreenCanvas.width;
          }

          ctx.beginPath();
          ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
          ctx.fill();
        });

        capturer.capture(offscreenCanvas);
      }

      capturer.stop();
      capturer.save();
    } catch (error) {
      console.error("GIF 생성 실패:", error);
    } finally {
      // 6. 스타일 원상복구
      cardElement.style.animation = originalAnimation;
      cardElement.style.transform = originalTransform;
      cardElement.style.opacity = originalOpacity;
      setIsCapturing(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowCopiedMsg(true);
    setTimeout(() => setShowCopiedMsg(false), 2000);
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
        <ResultCard ref={cardRef} id="result-card">
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
          <ActionButton onClick={() => navigate("/")} disabled={isCapturing}>
            테스트 다시하기
          </ActionButton>
          <ActionButton onClick={handleSave} disabled={isCapturing}>
            이미지 저장
          </ActionButton>
          <ActionButton onClick={handleCopyLink} disabled={isCapturing}>
            링크 복사
          </ActionButton>
          <ActionButton onClick={handleSaveGif} disabled={isCapturing}>
            {isCapturing ? "GIF 만드는 중..." : "움직이는 카드 저장"}
          </ActionButton>
        </ButtonGroup>
        {showCopiedMsg && <CopiedMessage>복사 완료!</CopiedMessage>}
      </Content>
    </Wrapper>
  );
}

export default ResultPage;
