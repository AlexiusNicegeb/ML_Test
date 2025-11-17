import { useState } from "react";
import { AnalyseResultErrorItem } from "../types/result";

export const SuggestionModal = ({
  errorItem,
  onClose,
  onTakenOver,
}: {
  errorItem: AnalyseResultErrorItem;
  onClose: () => void;
  onTakenOver: (text: string) => void;
}) => {
  const [inputValue, setInputValue] = useState(errorItem.suggestion);
  return (
    <div className="suggestion-modal">
      <div className="inner">
        <h3 className="font-bold">Korrekturvorschlag</h3>

        <p className="mb-2">
          <span className="font-bold">Fehler:</span>
          <span className="ml-2">{errorItem.error}</span>
        </p>
        <p className="mb-6">
          <span className="font-bold">Vorschlag:</span>
          <span className="ml-2">{errorItem.suggestion}</span>
        </p>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.currentTarget.value)}
          className="mb-6 correction-input"
        ></input>

        <div className="flex gap-3 w-full">
          <button type="button" className="close-button" onClick={onClose}>
            Abbrechen
          </button>
          <button
            type="button"
            className="take-over-button"
            onClick={() => onTakenOver(inputValue)}
          >
            Übernehmen
          </button>
        </div>
      </div>
    </div>
  );
};
