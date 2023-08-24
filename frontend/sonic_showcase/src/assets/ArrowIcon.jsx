import React from 'react';
import { useState } from 'react';

function ArrowIcon(props) {

    const [hovered, setHovered] = useState(false);

    const baseStroke = "#FFFFFF";
    const hoverStroke = "#9C27B0";

  return (
    <svg 
      width="3vw" 
      height="6vh"
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      <path 
        d="M11 16L15 12M15 12L11 8M15 12H3M4.51555 17C6.13007 19.412 8.87958 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C8.87958 3 6.13007 4.58803 4.51555 7" 
        stroke={hovered ? hoverStroke : baseStroke}  
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ArrowIcon;
