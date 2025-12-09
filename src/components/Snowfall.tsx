// src/components/Snowfall.tsx
import { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fall = keyframes`
  0% { transform: translateY(-10vh); opacity: 0; }
  5% { opacity: 1; }
  95% { opacity: 1; }
  100% { transform: translateY(100vh); opacity: 0; }
`;

const Snowflake = styled.div<{
  left: number;
  animationDuration: number;
  animationDelay: number;
  size: number;
}>`
  position: fixed;
  top: 0;
  left: ${(props) => props.left}%;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  background: white;
  border-radius: 50%;
  opacity: 0;
  animation: ${fall} linear infinite;
  animation-duration: ${(props) => props.animationDuration}s;
  animation-delay: ${(props) => props.animationDelay}s;
  z-index: 10;
  pointer-events: none; /* Make sure snowflakes don't block clicks */
`;

function Snowfall() {
  const snowflakeCount = 100; // Adjust for more/less snow

  const [snowflakes] = useState(() =>
    Array.from({ length: snowflakeCount }).map((_, i) => {
      const left = Math.random() * 100;
      const animationDuration = Math.random() * 5 + 5; // 5 to 10 seconds
      const animationDelay = Math.random() * 10;
      const size = Math.random() * 3 + 1; // 1 to 4px

      return (
        <Snowflake
          key={i}
          left={left}
          animationDuration={animationDuration}
          animationDelay={animationDelay}
          size={size}
        />
      );
    })
  );

  return <>{snowflakes}</>;
}

export default Snowfall;
