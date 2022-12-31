import React, { useEffect, useState } from 'react';
import { Flex, Box } from 'reflexbox';
import { Button } from './Button';
import { PRIMARY_1 } from '../constants/style';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { lg } from '../constants/media-queries';
import { INotif, Notif } from './Notif';
import { DANGER } from '../constants/style';

export const Choices = () => {
  const navigate = useNavigate();
  const isLg = useMediaQuery(lg);
  const isBiometricAuth = JSON.parse(import.meta.env.VITE_BIOMETRIC_AUTH);
  const [notif, setNotif] = useState<INotif>({
    content: undefined,
    type: undefined,
  });

  useEffect(() => {
    // @ts-ignore
    const unauthorized = JSON.parse(localStorage.getItem('Unauthorized'));

    if (unauthorized !== null) {
      localStorage.removeItem('Unauthorized');
      setNotif({
        content: 'Unauthorized, Please login first',
        type: DANGER,
      });
    }
  }, []);

  return (
    <div>
      <Flex justifyContent='center'>
        <Notif content={notif.content} type={notif.type} />
      </Flex>
      <h1>Find your Way</h1>

      <Flex
        width={[1, 1, '800px']}
        flexDirection={isLg ? 'row' : 'column'}
        justifyContent='space-between'
        alignItems='center'
      >
        <Box my={isLg ? 6 : 4} width={[1, 1, '200px']} color='white'>
          <Button
            content={'Login'}
            color={PRIMARY_1}
            click={() => navigate('/login')}
          />
        </Box>
        <Box my={isLg ? 6 : 4} width={[1, 1, '200px']} color='white'>
          <Button
            content={'Find your way'}
            color={PRIMARY_1}
            click={() => navigate('/recognise')}
          />
        </Box>
        {isBiometricAuth && (
          <Box my={isLg ? 6 : 4} width={[1, 1, '200px']} color='white'>
            <Button
              content={'Add a new user'}
              color={PRIMARY_1}
              click={() => navigate('/register')}
            />
          </Box>
        )}
      </Flex>
    </div>
  );
};
