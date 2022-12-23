import React from 'react';
import styled from 'styled-components';
import { Flex } from 'reflexbox';

const Button = styled.button`
  border: none;
  background: none;
  user-select: none;
  cursor: pointer;
`;
const Styled = styled(Flex)`
  background: rgba(49, 50, 56, 0.9);
  border-radius: 100px;
  transition: all 0.1s;
  cursor: pointer;
  backdrop-filter: blur(10px);
  z-index: 1;

  &:hover {
    background: rgba(49, 50, 56, 0.9);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.99);
  }
`;

interface Props {
  children: JSX.Element;
  onClick?: (...params: any[]) => any;
  width?: number;
  title?: string;
  disabled?: boolean;
}

export const RoundedButton = (props: Props) => {
  return (
    <Button onClick={props.onClick} disabled={props.disabled}>
      <Styled
        justifyContent='center'
        alignItems='center'
        flexShrink={0}
        maxWidth={props.width}
        maxHeight={props.width}
        minWidth={props.width}
        minHeight={props.width}
        width={props.width}
        height={props.width}
        title={props.title}
      >
        {props.children}
      </Styled>
    </Button>
  );
};

export default RoundedButton;
