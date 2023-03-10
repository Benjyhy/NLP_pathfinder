import React from 'react';
import { SVGProps } from 'react';
import SVG from './SVG';

const PlayIcon = (props: SVGProps<SVGElement>) => {
  return (
    <SVG
      xmlns='http://www.w3.org/2000/svg'
      width='1em'
      height='1em'
      viewBox='0 0 512 512'
      {...props}
    >
      <path
        d='M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z'
        fill='none'
      />
      <path d='M216.32 334.44l114.45-69.14a10.89 10.89 0 000-18.6l-114.45-69.14a10.78 10.78 0 00-16.32 9.31v138.26a10.78 10.78 0 0016.32 9.31z' />
    </SVG>
  );
};

export default PlayIcon;
