import React from 'react';
import { useState } from 'react';

const Logo = () => {

  const [hovered, setHovered] = useState(false);

  const baseStroke = "#FFFFFF";
  const hoverStroke = "#4A148C";
  const fill = hovered ? hoverStroke : baseStroke

  return (
    <svg width="2.7vw" height="10vh" viewBox="0 0 32 32" enableBackground="new 0 0 32 32" id="Stock_cut" version="1.1" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <desc />
      <g>
        <circle cx="16" cy="16" fill="none" r="15" stroke={fill} strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" />
        <path d="M26,27L26,27 c0-5.523-4.477-10-10-10h0c-5.523,0-10,4.477-10,10v0" fill="none" stroke={fill} strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" />
        <circle cx="16" cy="11" fill="none" r="6" stroke={fill} strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" />
      </g>
    </svg>
  )
};

export default Logo;
