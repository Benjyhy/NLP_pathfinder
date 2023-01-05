import React from 'react';
import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Animated = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 200px;
  animation: ${rotate} 1.5s ease infinite;
  border: 3px solid white;
  clip-path: polygon(
    29% 24%,
    70% 24%,
    84% 0,
    100% 0,
    100% 100%,
    0 100%,
    0 0,
    18% 0
  );
`;

interface Props {
  opacity?: number;
}

const Loader = (props: Props) => {
  return <Animated style={{ opacity: props.opacity || 1 }} />;
};

export default Loader;
