import { useEffect, useMemo, useRef, useState } from "react";

export const useTypeWriter = (text: string, speed = 40) => {
  const [typed, setTyped] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const memoizedText = useMemo(() => text, [text]);

  useEffect(() => {
    let i = 0;
    setTyped("");

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setTyped((prev) => {
        const next = memoizedText.slice(0, i + 1);
        i++;
        if (i >= memoizedText.length && intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return next;
      });
    }, speed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [memoizedText, speed]);

  return typed;
};
