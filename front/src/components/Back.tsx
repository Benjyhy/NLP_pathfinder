import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex } from 'reflexbox';
import RoundedButton from '../components/RoundedButton';
import BackIcon from '../icons/BackIcon';

export const Back = () => {
  let navigate = useNavigate();
  return (
    <Flex
      mt={10}
      px={10}
      width='100%'
      style={{
        position: 'fixed',
        zIndex: 999,
        top: 10,
        left: 10,
        border: '2px solid transparent',
      }}
    >
      <RoundedButton
        onClick={() => navigate(-1)}
        width={35}
        title="Retourner à l'accueil"
      >
        <BackIcon width='23px' stroke='white' />
      </RoundedButton>
    </Flex>
  );
};
