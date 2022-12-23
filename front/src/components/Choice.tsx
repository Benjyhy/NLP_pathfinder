import React, { useState } from 'react';
import { Flex, Box } from 'reflexbox';
import { Button } from './Button';
import { PRIMARY_1 } from '../constants/style';
import { useNavigate } from 'react-router-dom';

export const Choices = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Find yout Way</h1>
      <Flex width={'600px'}>
        <Box p={3} width={1 / 2} color='white'>
          <Button
            content={'Add a new user'}
            color={PRIMARY_1}
            click={() => navigate('/register')}
          />
        </Box>
        <Box p={3} width={1 / 2} color='white'>
          <Button
            content={'Find your way'}
            color={PRIMARY_1}
            click={() => navigate('/recognise')}
          />
        </Box>
      </Flex>
    </div>
  );
};
