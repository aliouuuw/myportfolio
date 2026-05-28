"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

interface ScrambleTextProps {
  text: string;
  className?: string;
  trigger?: "hover" | "mount";
}

export function ScrambleText({ text, className = "", trigger = "hover" }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(trigger === "mount" ? "" : text);
  const isAnimating = useRef(false);
  const originalText = useRef(text);

  // Update ref if text changes
  useEffect(() => {
    originalText.current = text;
    if (trigger === "hover" && !isAnimating.current) {
      setDisplayText(text);
    }
  }, [text, trigger]);

  const scramble = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    let iteration = 0;
    const target = originalText.current;
    const interval = setInterval(() => {
      setDisplayText(() =>
        target
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) {
              return target[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join(""),
      );

      if (iteration >= target.length) {
        clearInterval(interval);
        isAnimating.current = false;
        setDisplayText(target);
      }

      iteration += 1 / 2; // Speed of reveal
    }, 30);
  };

  useEffect(() => {
    if (trigger === "mount") {
      scramble();
    }
  }, [trigger]);

  return (
    <span
      className={className}
      onMouseEnter={trigger === "hover" ? scramble : undefined}
    >
      {displayText}
    </span>
  );
}
