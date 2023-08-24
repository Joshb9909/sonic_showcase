import React from 'react';
import { useState } from 'react';

const NewPostIcon = () => {

    const [hovered, setHovered] = useState(false);

    const baseStroke = "#FFFFFF";
    const hoverStroke = "#4A148C";
    const fill = hovered ? hoverStroke : baseStroke

    return (
        <svg width="3.2vw" height="10vh" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <circle cx="12" cy="12" r="10" stroke={fill} strokeWidth="1" />
            <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke={fill} strokeWidth="1" strokeLinecap="round" />
        </svg>
    );
};

export default NewPostIcon;
