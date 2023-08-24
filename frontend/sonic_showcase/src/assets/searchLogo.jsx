import React from "react";
import { useState } from "react";

const SearchLogo = () => {

    const [hovered, setHovered] = useState(false);

    const baseStroke = "#FFFFFF";
    const hoverStroke = "#4A148C";
    const fill = hovered ? hoverStroke : baseStroke

    return (
        <svg width="3.5vw" height="10vh" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none" stroke={fill} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <circle cx="32" cy="32" r="24" strokeWidth='3' />
            <circle cx="28" cy="28" r="8" strokeWidth='3' />
            <line x1="44" y1="44" x2="33.66" y2="33.66" strokeWidth='3' />
        </svg>
    );
}

export default SearchLogo;
