import React from 'react';
import { SVGProps } from 'react';
import SVG from './SVG';

const CloseIcon = (props: SVGProps<SVGElement>) => {
  return (
    <SVG
      xmlns='http://www.w3.org/2000/svg'
      width={props.width}
      height={props.height}
      viewBox='0 0 512 512'
      {...props}
    >
      <path d='M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z' />
    </SVG>
  );
};

export default CloseIcon;
