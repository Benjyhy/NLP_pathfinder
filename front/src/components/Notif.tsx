import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex } from 'reflexbox';
import RoundedButton from '../components/RoundedButton';
import BackIcon from '../icons/BackIcon';
import { WARNING, PRIMARY_1, DANGER } from '../constants/style';
import styled from 'styled-components';

const Styled = styled(Flex)`
  position: fixed;
  top: 30px;
  z-index: 99999;
  border: 2px solid transparent;
  transition: all 0.3s;
`;

export interface INotif {
  content?: string | undefined;
  type: typeof PRIMARY_1 | typeof DANGER | typeof WARNING | undefined;
}

export const NotifDefaultState = {
  content: undefined,
  type: undefined,
};
export const Notif = ({ content, type }: INotif) => {
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    if (content != undefined) {
      setShow(true);
      setTimeout(() => {
        setShow(false);
      }, 1500);
    }
  }, [content]);

  return (
    <Styled
      style={{
        opacity: show ? 1 : 0,
      }}
    >
      <Flex
        px={30}
        width='100%'
        alignItems='center'
        flex={1}
        backgroundColor={type}
        height={50}
        style={{
          borderRadius: 12,
          boxShadow: '0 2px 20px 0 rgb(37, 38, 44, 80%)',
        }}
      >
        <span style={{ fontSize: '#fff' }}>{content}</span>
      </Flex>
    </Styled>
  );
};
