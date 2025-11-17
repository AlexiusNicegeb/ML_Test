import { IS_PRODUCTION } from "@/app/constants";
import { useEffect, useState } from "react";
import { AnalyseResult } from "../types/result";
import { mapAnalyseResult } from "./analyse-mapper";
import { DUMMY_RESULT, DUMMY_TEXT } from "./dummy";

export const Trainer = ({
  onSubmit: submitted,
}: {
  onSubmit: (result: AnalyseResult, text: string) => void;
}) => {
  const MIN_WORDS = IS_PRODUCTION ? 5 : 1;
  const [text, setText] = useState(DUMMY_TEXT);
  const [wordCounter, setWordCounter] = useState(0);
  const [history, setHistory] = useState<string[]>([text]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const updateWordCount = () => {
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    setWordCounter(words);
  };

  const onSubmit = async () => {
    const data = await fetch("ADD_ENDPOINT_HERE", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    // if (!data.ok) {
    //   alert("Fehler beim Absenden des Textes. Bitte versuche es erneut.");
    //   return;
    // }
    //const result = await data.json();
    const result = DUMMY_RESULT;
    submitted(mapAnalyseResult(result), text);
  };

  const saveState = () => {
    if (history[historyIndex] !== text) {
      const newh = history.slice(0, historyIndex + 1);
      newh.push(text);
      setHistory([...history, text]);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setText(history[historyIndex - 1]);
      updateWordCount();
    }
  };

  useEffect(() => {
    updateWordCount();
    saveState();
  }, [text]);

  return (
    <div className="page-wrapper">
      <div className="writing-container box">
        <div className="editor-wrapper">
          <textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Beginne hier mit deinem Leserbrief..."
          ></textarea>
        </div>
        <div className="editor-footer">
          <div className="footer-left">
            <button
              type="button"
              id="undo-button"
              disabled={historyIndex <= 0}
              onClick={undo}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"
                ></path>
                <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"></path>
              </svg>
              Rückgängig
            </button>
            <div id="word-counter">
              {wordCounter} {wordCounter === 1 ? "Wort" : "Wörter"}
            </div>
          </div>
          <button
            type="button"
            id="submit-button"
            disabled={wordCounter < MIN_WORDS}
            onClick={onSubmit}
          >
            Abgeben
          </button>
        </div>
      </div>
    </div>
  );
};
