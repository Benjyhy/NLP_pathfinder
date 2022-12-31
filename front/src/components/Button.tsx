// @ts-nocheck
import React from 'react';
import styled, { CSSProperties } from 'styled-components';

const ButtonStyle = styled.button`
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  background: none;
  color: white;
  width: 100%;
  user-select: none;
  cursor: pointer;
  transition: transform 0.1s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.99);
  }

  background: ${props => props.color || 'transparent'}!important;
  background: linear-gradient(
    156deg,
    ${props => props.color || 'transparent'} 0%,
    ${props => props.color || 'transparent'} 100%
  );
  padding: 0.7rem 1.4rem;
  margin: 8px 0;
  border-radius: 10px;
  box-shadow: 0px 5px 20px 0px ${props => props.color || 'transparent'}33;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0px 5px 25px 0px ${props => props.color || '#fff'}39;
    background: hsla(0, 0%, 100%, ${props => props.color || '.05'}) !important;
  }

  &:active {
    transform: scale(0.99);
    box-shadow: 0px 5px 25px 0px ${props => props.color || 'transparent'}29;
  }
`;

type ButtonType = 'submit' | 'button' | 'reset' | 'undefined';
interface Props {
  color?: string;
  classname?: string;
  content?: string | JSX.Element;
  value?: any;
  click?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: CSSProperties;
  disabled?: boolean;
}

export const Button = (props: Props) => {
  return (
    <div>
      <ButtonStyle
        onClick={props.click}
        value={props.value}
        color={props.color}
        className={props.classname}
        style={{
          ...(props.style || {}),
        }}
        disabled={props.disabled}
      >
        {props.content!}
      </ButtonStyle>
    </div>
  );
};

export default Button;
