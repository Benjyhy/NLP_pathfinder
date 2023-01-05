import React from 'react';
import styled, { CSSProperties } from 'styled-components';
import Button from './Button';
import { useNavigate } from 'react-router-dom';
import { PRIMARY_2 } from '../constants/style';
import { Flex } from 'reflexbox';

const AudioRefusedStyle = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  min-height: 100vh;
  width: 100%;
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(49, 50, 56, 0.1);
  backdrop-filter: blur(50px);
`;

export const AudioRefused = () => {
  const navigate = useNavigate();
  return (
    <div>
      <AudioRefusedStyle>
        <Flex
          width={'800px'}
          justifyContent='center'
          alignItems='center'
          flexDirection='column'
          style={{ fontSize: '30px', fontWeight: 700, textAlign: 'center' }}
        >
          <p>
            Vous devez activer l'autorisation du microphone pour utiliser la
            plateforme 😁
          </p>
          <Button
            content={'Retour'}
            color={PRIMARY_2}
            click={() => navigate('/')}
          />
        </Flex>
      </AudioRefusedStyle>
    </div>
  );
};

export default AudioRefused;
