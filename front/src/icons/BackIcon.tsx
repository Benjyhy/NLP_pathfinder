import React from 'react';
import { SVGProps } from 'react';
import SVG from './SVG';

const BackIcon = (props: SVGProps<SVGElement>) => {
  return (
    <SVG
      xmlns='http://www.w3.org/2000/svg'
      height={props.height}
      viewBox='0 0 512 512'
      {...props}
    >
      <path fill='none' d='M244 400L100 256l144-144M120 256h292' />
    </SVG>
  );
};

export default BackIcon;
