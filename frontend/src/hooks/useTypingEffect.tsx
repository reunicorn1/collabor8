import { useState, useEffect } from 'react';

function useTypingEffect(text: string, speed = 100, start = true) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (!start) {
      return;
    }

    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (currentIndex < text.length - 1) {
        setDisplayedText((prev) => prev + text[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed, start]);

  return displayedText;
}

export default useTypingEffect;
