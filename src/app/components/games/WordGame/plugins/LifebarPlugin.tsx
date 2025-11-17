import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef, useState } from "react";
import { $getRoot } from "lexical";
import {
  FAIL_LIFE_COMMAND,
  ERROR_FEEDBACK_COMMAND,
  GOOD_FEEDBACK_COMMAND,
} from "./FeedbackPlugin"; 

interface LifebarPluginProps {
  onGameOver?: () => void;
}

export function LifebarPlugin({ onGameOver }: LifebarPluginProps) {
  const [editor] = useLexicalComposerContext();
  const [life, setLife] = useState(100);

  // Ref to hold the current text content.
  const currentTextRef = useRef("");
  // Ref to hold the previous text length (for the 5-second interval).
  const prevLengthRef = useRef(0);
  // Ref to track the previous count of "error" occurrences (if you need it for other purposes).
  const prevErrorCountRef = useRef(0);

  // Immediate update listener: update text and check for new "error" occurrences.
  useEffect(() => {
    const unregister = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const text = $getRoot().getTextContent();
        currentTextRef.current = text;

        // Count occurrences of "error" (case-insensitive).
        const errorMatches = text.match(/error/gi);
        const errorCount = errorMatches ? errorMatches.length : 0;
        const prevErrorCount = prevErrorCountRef.current;

        if (errorCount > prevErrorCount) {
          // Calculate how many new errors were introduced.
          const newErrors = errorCount - prevErrorCount;
          // Subtract life immediately (5 points per new error).
          setLife((prevLife) => {
            const newLife = Math.max(prevLife - 5 * newErrors, 0);
            if (newLife === 0 && prevLife !== 0) {
              setTimeout(() => {
                editor.dispatchCommand(FAIL_LIFE_COMMAND, undefined);
                if (onGameOver) onGameOver();
              }, 0);
            }
            return newLife;
          });
          // Dispatch a feedback command for each new error.
          for (let i = 0; i < newErrors; i++) {
            setTimeout(() => {
              editor.dispatchCommand(ERROR_FEEDBACK_COMMAND, undefined);
            }, 0);
          }
        }
        // Update the previous error count for next update.
        prevErrorCountRef.current = errorCount;
      });
    });
    return () => unregister();
  }, [editor, onGameOver]);

  // Every 5 seconds, compute how many characters were typed and update life.
  useEffect(() => {
    const interval = setInterval(() => {
      const currentLength = currentTextRef.current.length;
      const delta = currentLength - prevLengthRef.current;
      // Prepare for the next interval.
      prevLengthRef.current = currentLength;

      setLife((prevLife) => {
        let newLife: number;
        if (delta < 10) {
          // Not enough characters typed: take 5 damage.
          newLife = Math.max(prevLife - 5, 0);
        } else {
          // Enough characters typed: add 5 life.
          newLife = Math.min(prevLife + 5, 100);
          // Dispatch the GOOD_FEEDBACK_COMMAND to show a "Good Job" message.
          setTimeout(() => {
            editor.dispatchCommand(GOOD_FEEDBACK_COMMAND, undefined);
          }, 0);
        }
        if (newLife === 0 && prevLife !== 0) {
          setTimeout(() => {
            editor.dispatchCommand(FAIL_LIFE_COMMAND, undefined);
            if (onGameOver) onGameOver();
          }, 0);
        }
        return newLife;
      });
    }, 5000); // 5-second interval

    return () => clearInterval(interval);
  }, [editor, onGameOver]);

  return (
    <div className="lifebar-container" >
      {/* <div
        style={{
          width: `${life}%`,
          backgroundColor: "green",
          height: "16px",
          transition: "width 0.2s ease-in-out",
        }}
      /> */}
      <p className="text-3xl font-black">{life}%</p>
    </div>
  );
}
