// @ts-nocheck
import React, { RefObject, useState } from 'react';
import styled from 'styled-components';
import { Flex } from 'reflexbox';

const SearchInput = styled.input`
  height: 50px;
  color: #fff;
  outline: none;
  background: none;
  border: none;
  font-weight: bold;
  font-size: 1rem;
`;

interface Props {
  placeholder: string;
  value?: string;
  refValue?: RefObject<HTMLInputElement | null>;
}

const Input = (props: Props) => {
  return (
    <Flex width={1} mx={2}>
      <SearchInput
        type='text'
        ref={props.refValue}
        placeholder={props.placeholder}
      />
    </Flex>
  );
};

export default Input;
