import React, { useState } from 'react';

const LikeIcon = () => {
  const [isFilled, setIsFilled] = useState(false);
  const [outLine, setOutline] = useState('#FFFFFF')

  const handleIconClick = () => {
    setIsFilled(!isFilled);
    if(outLine === '#FFFFFF'){
        setOutline('#9C27B0')
    } else {
        setOutline('#FFFFFF')
    }

  };

  

  const fillColor = isFilled ? '#9C27B0' : 'none'; // Change '#ff0000' to your desired fill color

  return (
    <svg onClick={handleIconClick} width="3vw" height="6vh" viewBox="0 0 48 48" id="b" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>{`.c { fill: ${fillColor}; stroke: ${outLine}; stroke-linecap: round; stroke-linejoin: round; }`}</style>
      </defs>
      <path className="c" d="m43,17.0766c0-5.6539-4.5835-10.2373-10.2374-10.2373-3.7223,0-6.9708,1.9932-8.7626,4.964-1.7919-2.9708-5.0403-4.964-8.7626-4.964-5.6539,0-10.2373,4.5834-10.2373,10.2373,0,1.2925.2496,2.524.6866,3.6627,3.3851,9.7368,18.3134,20.4215,18.3134,20.4215,0,0,14.9282-10.6847,18.3134-20.4215.437-1.1386.6867-2.3702.6867-3.6627Z"/>
    </svg>
  );
};

export default LikeIcon;