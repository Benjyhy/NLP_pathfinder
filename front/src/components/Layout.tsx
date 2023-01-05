import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex } from 'reflexbox';
import RoundedButton from './RoundedButton';
import { WARNING } from '../constants/style';
import BackIcon from '../icons/BackIcon';
import LogoutIcon from '../icons/Logout';
import UsersOutlineIcon from '../icons/UsersOutlineIcon';

export const Layout = () => {
  let navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('accessToken');
    navigate('/');
  };
  return (
    <div>
      <Flex
        mt={10}
        px={10}
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
      <Flex
        mt={10}
        px={10}
        style={{
          position: 'fixed',
          zIndex: 999,
          top: 10,
          right: 10,
          border: '2px solid transparent',
        }}
      >
        <RoundedButton
          onClick={logout}
          width={35}
          title="Retourner à l'accueil"
        >
          <UsersOutlineIcon width='23px' stroke={WARNING} />
        </RoundedButton>
      </Flex>
    </div>
  );
};
