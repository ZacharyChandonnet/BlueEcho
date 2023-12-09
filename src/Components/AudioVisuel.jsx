import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAudioVisual } from '../Musique/AudioManager';

// https://www.npmjs.com/package/p5.createloop

const Container = styled.div`
  display: flex;
  height: 100px;
  max-height: 20px;
  overflow: hidden;
  transform: rotate(180deg);
  margin: auto;
`;

const Bar = styled.div`
  width: 100%;
  height: ${props => props.height}%;
  background-color: ${props => props.backgroundcolor};
  margin-right: 1px;
  opacity: 0.5;
  transition: height 0.2s ease-in-out, background-color 5s ease-in-out;
`;

const AudioVisuel = () => {
  const visualInfos = useAudioVisual();
  const [commonColor, setCommonColor] = useState(generateRandomColor());

  useEffect(() => {
    // Change the common color every 5 seconds
    const intervalId = setInterval(() => {
      setCommonColor(generateRandomColor());
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  function generateRandomColor() {
    // Generate a random color using hex values
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  }

  return (
    <Container>
      {visualInfos.map((height, index) => (
        <Bar
          key={index}
          height={(height / visualInfos.length) * 100}
          backgroundcolor={commonColor}
        />
      ))}
    </Container>
  );
};

export default AudioVisuel;
