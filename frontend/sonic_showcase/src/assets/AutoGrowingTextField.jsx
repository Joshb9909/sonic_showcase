import React, { useRef, useEffect, useState } from 'react';

function AutoGrowingTextarea({ text, setText }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  return (
    <textarea
      ref={textareaRef}
      value={text}
      onChange={e => setText(e.target.value)}
      style={{ resize: 'none', overflow: 'hidden' }}
      className="resize-none overflow-hidden bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-800 focus:border-purple-800 w-full ml-3 inline-flex dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-800 dark:focus:border-purple-800"
      placeholder="Add a comment..."
    ></textarea>
  );
}

export default AutoGrowingTextarea;


