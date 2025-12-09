import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import html2canvas from "html2canvas";
import ReactConfetti from "react-confetti";
import YouTube from "react-youtube";
import type { YouTubePlayer } from "react-youtube";
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
    recommend: string[]; // recommend is now an array of strings
    song: string;
    image: string;
    songUrl?: string; // songUrl is optional
  };
};

const typedResults: ResultData = results;

// YouTube URL에서 비디오 ID를 추출하는 헬퍼 함수
const getVideoId = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    if (
      urlObj.hostname === "www.youtube.com" ||
      urlObj.hostname === "youtube.com"
    ) {
      return urlObj.searchParams.get("v");
    }
    if (urlObj.hostname === "youtu.be") {
      return urlObj.pathname.slice(1);
    }
  } catch (e) {
    console.error("Invalid URL", e);
  }
  return null;
};

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
  border-radius: 10px;
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

const MusicController = styled.div`
  background-color: #2d3e50;
  padding: 15px 30px;
  border-radius: 10px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 200px;
  margin: 0 auto;
`;

const SongTitle = styled.span`
  font-size: 0.9rem;
  color: #fff8e7;
  text-align: left;
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PlayButton = styled.button`
  background: none;
  border: none;
  color: #fff8e7;
  cursor: pointer;
  padding: 0 10px;

  svg {
    width: 24px;
    height: 24px;
    fill: currentColor;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
  max-width: 500px;
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

const PlayIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

function ResultPage() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);
  const [showCopiedMsg, setShowCopiedMsg] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  const result = type ? typedResults[type] : null;
  const videoId = result?.songUrl ? getVideoId(result.songUrl) : null;

  const onPlayerReady = (event: { target: YouTubePlayer }) => {
    playerRef.current = event.target;
  };

  const onPlayerStateChange = (event: { data: number }) => {
    // Sync isPlaying state with player state
    if (event.data === 1) {
      // Playing
      setIsPlaying(true);
    } else if (event.data === 2) {
      // Paused
      setIsPlaying(false);
    }
  };

  const handlePlayPause = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSave = async () => {
    const cardElement = cardRef.current;
    if (!cardElement) return;

    // Temporarily hide music controller
    const controller =
      cardElement.querySelector<HTMLElement>("#music-controller");
    if (controller) controller.style.display = "none";

    try {
      const canvas = await html2canvas(cardElement, {
        backgroundColor: "#2d3e50",
        useCORS: true,
        scale: 2,
      });

      const link = document.createElement("a");
      link.download = "my-christmas-card.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("이미지 저장 실패:", error);
    } finally {
      if (controller) controller.style.display = "flex"; // Show it again
    }
  };

  const handleSaveGif = async () => {
    const cardElement = cardRef.current;
    if (!cardElement || isCapturing) return;

    setIsCapturing(true);
    // Temporarily hide music controller
    const controller =
      cardElement.querySelector<HTMLElement>("#music-controller");
    if (controller) controller.style.display = "none";

    try {
      const gifScale = 1.5;
      const cardCanvas = await html2canvas(cardElement, {
        backgroundColor: "#2d3e50",
        useCORS: true,
        scale: gifScale,
        scrollX: 0,
        scrollY: -window.scrollY,
      });
      //... (rest of the GIF logic is the same)
      const offscreenCanvas = document.createElement("canvas");
      offscreenCanvas.width = cardCanvas.width;
      offscreenCanvas.height = cardCanvas.height;
      const ctx = offscreenCanvas.getContext("2d")!;
      const snowflakes = Array.from({ length: 60 }, () => ({
        x: Math.random() * offscreenCanvas.width,
        y: Math.random() * offscreenCanvas.height,
        radius: (Math.random() * 2 + 1) * (gifScale * 0.7),
        speed: (Math.random() * 2 + 3) * (gifScale * 0.7),
      }));
      const fps = 15;
      const capturer = new window.CCapture({
        format: "gif",
        workersPath: "/",
        verbose: false,
        framerate: fps,
        quality: 10,
      });
      capturer.start();
      const durationSec = 2;
      const totalFrames = durationSec * fps;
      for (let i = 0; i < totalFrames; i++) {
        ctx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
        ctx.drawImage(cardCanvas, 0, 0);
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        snowflakes.forEach((flake) => {
          flake.y += flake.speed;
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
      if (controller) controller.style.display = "flex"; // Show it again
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

  const youtubeOpts = {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: 1,
      loop: 1,
      playlist: videoId,
      controls: 0,
      showinfo: 0,
    },
  };

  return (
    <Wrapper>
      {videoId && (
        <YouTube
          videoId={videoId}
          opts={youtubeOpts}
          onReady={onPlayerReady}
          onStateChange={onPlayerStateChange}
        />
      )}
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
          <Subtitle>나의 크리스마스 스타일은...</Subtitle>
          <Title>{result.name}</Title>
          <ResultImage src={result.image} alt={result.name} />
          <Description>"{result.description}"</Description>

          <RecommendBox>
            <RecommendTitle>✨ 이런 활동은 어때요?</RecommendTitle>
            {result.recommend.map((data, index) => {
              return <p key={index}>{data}</p>;
            })}
          </RecommendBox>

          <RecommendBox>
            <RecommendTitle>🎵 추천 캐롤</RecommendTitle>
            <p>{result.song}</p>
            {videoId && (
              <MusicController id="music-controller">
                <SongTitle>Play Song</SongTitle>
                <PlayButton onClick={handlePlayPause}>
                  {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </PlayButton>
              </MusicController>
            )}
          </RecommendBox>
        </ResultCard>

        <ButtonGroup>
          <ActionButton onClick={() => navigate("/")} disabled={isCapturing}>
            테스트 다시하기
          </ActionButton>
          <ActionButton onClick={handleCopyLink} disabled={isCapturing}>
            링크 복사
          </ActionButton>
          <ActionButton onClick={handleSave} disabled={isCapturing}>
            이미지 저장
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
